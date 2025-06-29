import { config } from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import { and, between, eq } from "drizzle-orm";
import emailjs, { EmailJSResponseStatus } from "@emailjs/nodejs";

import { db } from "../drizzle";
import { validateSession } from "../lib/auth";
import { user, verification } from "../drizzle/schema";
import { generateEmailTemplate } from "../lib/utils";
import { emailRequestBodySchema, emailTypeSchema } from "../lib/schema";

config({ path: ".env.local" });

export async function sendEmail(req: Request, res: Response) {
  try {
    const { to_email, to_name } = req.body;
    const { type } = req.query;

    if (!to_email || !to_name) {
      return res.status(400).send({
        message: "Email address and recipient name are required",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    if (!type) {
      return res.status(400).send({
        message: "Email type parameter is required in the request URL",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const isValidEmailType = emailTypeSchema.safeParse(type);

    if (isValidEmailType.error) {
      return res.status(400).send({
        message: `Invalid email type '${type}'. Must be one of the supported email types.`,
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const isValidEmailRequestBody = emailRequestBodySchema.safeParse({
      to_email,
      to_name,
    });

    if (isValidEmailRequestBody.error) {
      return res.status(400).send({
        message:
          "Invalid email request data. Please check the email address and recipient name format.",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    if (isValidEmailType.data === "close-account") {
      const { isValidSession } = await validateSession(req);
      if (!isValidSession) {
        return res.status(401).send({
          message: "Invalid or expired token",
          error: "Unauthorized",
          statusCode: 401,
        });
      }
    }

    if (
      isValidEmailType.data === "close-account" ||
      isValidEmailType.data === "forgot-password"
    ) {
      const userExist = db.select().from(user).where(eq(user.email, to_email));
      const userExists = await userExist;

      if (userExists.length === 0) {
        return res.status(404).send({
          message: "User not found with the provided email address",
          error: "Not Found",
          statusCode: 404,
        });
      }
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const existingToken = await db
      .select()
      .from(verification)
      .where(
        and(
          eq(verification.identifier, to_email),
          eq(verification.type, isValidEmailType.data),
          between(verification.createdAt, twentyFourHoursAgo, now)
        )
      );

    if (existingToken.length > 0) {
      return res.status(429).send({
        message:
          "Verification email already sent within the last 24 hours. Please check your inbox.",
        error: "Too Many Requests",
        statusCode: 429,
      });
    }

    await db.delete(verification).where(eq(verification.identifier, to_email));

    const { nanoid } = await import("nanoid");

    const token =
      isValidEmailType.data === "forgot-password" ? nanoid() : uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const [data] = await db
      .insert(verification)
      .values({
        id: uuidv4(),
        type: isValidEmailType.data,
        identifier: to_email,
        value: token,
        expiresAt,
      })
      .returning();

    if (!data) {
      return res.status(500).send({
        message: "Failed to create verification token. Please try again.",
        error: "Internal Server Error",
        statusCode: 500,
      });
    }

    const templateParams = generateEmailTemplate(
      isValidEmailRequestBody.data.to_email,
      isValidEmailRequestBody.data.to_name,
      token,
      isValidEmailType.data
    );

    const templateId =
      isValidEmailType.data === "forgot-password"
        ? process.env.EMAILJS_PASSWORD_RESET_TEMPLATE_ID
        : isValidEmailType.data === "close-account"
        ? process.env.EMAILJS_ACCOUNT_DELETION_TEMPLATE_ID
        : process.env.EMAILJS_SIGNUP_TEMPLATE_ID;

    try {
      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID ?? "",
        templateId ?? "",
        templateParams,
        { publicKey: process.env.EMAILJS_PUBLIC_KEY ?? "" }
      );
    } catch (error) {
      await db.delete(verification).where(eq(verification.id, data.id));

      if (error instanceof EmailJSResponseStatus) {
        return res.status(error.status).send({
          message: error.text,
          error: "Internal Server Error",
          statusCode: error.status,
        });
      }

      return res.status(500).send({
        message: "Failed to send email. Please try again later.",
        error: "Internal Server Error",
        statusCode: 500,
      });
    }

    return res.status(201).send({
      message: "Email sent successfully",
      data: null,
      statusCode: 201,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Failed to send email. Please try again later.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

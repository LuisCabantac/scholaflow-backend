import z from "zod/v4";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { user } from "../drizzle/schema";
import { validateSession } from "../lib/auth";

const emailSchema = z.email();

export async function getUserByEmail(req: Request, res: Response) {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).send({
        message: "Email parameter is required",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const { isValidSession } = await validateSession(req);

    if (!isValidSession) {
      return res.status(401).send({
        message: "Invalid or expired token",
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    const isEmail = emailSchema.safeParse(email);

    if (isEmail.error) {
      return res.status(400).send({
        message: "Invalid email format",
        error: "Bad Request",
        statusCode: 400,
        details: isEmail.error.issues,
      });
    }

    const [data] = await db
      .select()
      .from(user)
      .where(eq(user.email, isEmail.data));

    if (!data) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404,
      });
    }

    return res
      .status(200)
      .send({ message: "User found", data, statusCode: 200 });
  } catch (error) {
    return res.status(500).send({
      message:
        error instanceof Error
          ? error.message
          : "There was an error retrieving the users data.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

export async function getUserById(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const { isValidSession } = await validateSession(req);

    if (!isValidSession) {
      return res.status(401).send({
        message: "Invalid or expired token",
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    if (!userId) {
      return res.status(400).send({
        message: "User ID is required",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const [data] = await db.select().from(user).where(eq(user.id, userId));

    if (!data) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404,
      });
    }

    return res
      .status(200)
      .send({ message: "User found", data, statusCode: 200 });
  } catch (error) {
    return res.status(500).send({
      message:
        error instanceof Error
          ? error.message
          : "There was an error retrieving the users data.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

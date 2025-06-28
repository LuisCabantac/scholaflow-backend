import z from "zod/v4";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { session, user } from "../drizzle/schema";

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

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({
        message: "No authorization header found",
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).send({
        message: "Invalid authorization header format",
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    const token = authHeader.substring(7);

    const [isAuthorized] = await db
      .select()
      .from(session)
      .where(eq(session.token, token));

    if (!isAuthorized) {
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

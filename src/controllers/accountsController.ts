import z from "zod/v4";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { account } from "../drizzle/schema";
import { validateSession } from "../lib/auth";

export async function getAccountByUserId(req: Request, res: Response) {
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

    const [data] = await db
      .select()
      .from(account)
      .where(eq(account.userId, userId));

    if (!data) {
      return res.status(404).send({
        message: "Account not found",
        error: "Not Found",
        statusCode: 404,
      });
    }

    return res
      .status(200)
      .send({ message: "Account found", data, statusCode: 200 });
  } catch (error) {
    return res.status(500).send({
      message:
        error instanceof Error
          ? error.message
          : "There was an error retrieving the account data.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

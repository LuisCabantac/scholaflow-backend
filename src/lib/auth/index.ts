import { eq } from "drizzle-orm";
import { Request } from "express";

import { db } from "../../drizzle";
import { session } from "../../drizzle/schema";

export async function validateSession(req: Request) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return {
      isValidSession: false,
      userId: null,
      message: "No authorization header found",
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  if (!authHeader.startsWith("Bearer ")) {
    return {
      isValidSession: false,
      userId: null,
      message: "Invalid authorization header format",
      error: "Unauthorized",
      statusCode: 401,
    };
  }

  const token = authHeader.substring(7);

  try {
    const [isAuthorized] = await db
      .select()
      .from(session)
      .where(eq(session.token, token));

    if (!isAuthorized) {
      return {
        isValidSession: false,
        userId: null,
        message: "Invalid or expired token",
        error: "Unauthorized",
        statusCode: 401,
      };
    }

    return {
      isValidSession: true,
      userId: isAuthorized.userId,
      message: "Session validated successfully",
      error: null,
      statusCode: 200,
    };
  } catch (error) {
    return {
      isValidSession: false,
      userId: null,
      message: "Failed to validate session due to internal error",
      error: "Internal Server Error",
      statusCode: 500,
    };
  }
}

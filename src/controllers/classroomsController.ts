import { desc, eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { classroom, session } from "../drizzle/schema";

export async function getAllCreatedClasses(req: Request, res: Response) {
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
        message: "Id parameter is required",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const data = await db
      .select()
      .from(classroom)
      .where(eq(classroom.teacherId, userId))
      .orderBy(desc(classroom.createdAt));

    if (!data) {
      return res.status(404).send({
        message: "Classes not found",
        error: "Not Found",
        statusCode: 404,
      });
    }

    return res
      .status(200)
      .send({ message: "Classes found", data, statusCode: 200 });
  } catch (error) {
    return res.status(500).send({
      message:
        error instanceof Error
          ? error.message
          : "There was an error retrieving the classrooms data.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

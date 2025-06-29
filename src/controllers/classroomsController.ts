import { desc, eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { classroom } from "../drizzle/schema";
import { validateSession } from "../lib/auth";

export async function getAllCreatedClasses(req: Request, res: Response) {
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

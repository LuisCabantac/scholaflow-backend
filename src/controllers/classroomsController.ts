import { desc, eq } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../drizzle";
import { classroomType } from "../lib/schema";
import { validateSession } from "../lib/auth";
import { classroom, enrolledClass } from "../drizzle/schema";

export async function getAllClasses(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const { type: classType } = req.query;

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

    if (!classType) {
      return res.status(400).send({
        message: "Class type parameter is required",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const isValidClassType = classroomType.safeParse(classType);

    if (isValidClassType.error) {
      return res.status(400).send({
        message: "Invalid class type.",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    if (isValidClassType.data === "created") {
      const data = await db
        .select()
        .from(classroom)
        .where(eq(classroom.teacherId, userId))
        .orderBy(desc(classroom.createdAt));

      if (!data.length) {
        return res
          .status(200)
          .send({ message: "No classes found", data: null, statusCode: 200 });
      }

      return res
        .status(200)
        .send({ message: "Classes found", data, statusCode: 200 });
    }

    if (isValidClassType.data === "enrolled") {
      const data = await db
        .select()
        .from(enrolledClass)
        .where(eq(enrolledClass.userId, userId))
        .orderBy(desc(enrolledClass.createdAt));

      if (!data.length) {
        return res
          .status(404)
          .send({ message: "No classes found", data: null, statusCode: 200 });
      }

      return res
        .status(200)
        .send({ message: "Classes found", data, statusCode: 200 });
    }
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

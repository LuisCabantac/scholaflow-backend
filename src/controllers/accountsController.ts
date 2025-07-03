import z from "zod/v4";
import { eq, or } from "drizzle-orm";
import { Request, Response } from "express";

import { db } from "../drizzle";
import {
  account,
  chat,
  classroom,
  notification,
  stream,
  streamComment,
  streamPrivateComment,
  user,
} from "../drizzle/schema";
import { validateSession } from "../lib/auth";
import {
  deleteFileFromBucket,
  deleteFilesFromBucket,
  extractAvatarFilePath,
  extractCommentFilePath,
  extractMessagesFilePath,
} from "../lib/utils";

export async function getAccountByUserId(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).send({
        message: "User ID is required",
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

export async function deleteUser(req: Request, res: Response) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).send({
        message: "User ID is required",
        error: "Bad Request",
        statusCode: 400,
      });
    }

    const { isValidSession, userId: sessionUserId } = await validateSession(
      req
    );

    if (!isValidSession) {
      return res.status(401).send({
        message: "Invalid or expired token",
        error: "Unauthorized",
        statusCode: 401,
      });
    }

    if (userId !== sessionUserId) {
      return res.status(403).send({
        message: "You are not authorized to delete this user account",
        error: "Forbidden",
        statusCode: 403,
      });
    }

    const [currentUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId));

    if (!currentUser) {
      return res.status(404).send({
        message: "User not found",
        error: "Not Found",
        statusCode: 404,
      });
    }

    const messages = await db
      .select()
      .from(chat)
      .where(eq(chat.userId, userId));

    if (messages.length) {
      const attachments = messages.map((chat) => chat.attachments).flat();

      if (attachments.length) {
        const chatAttachmentsFilePath: string[] = attachments.map((file) =>
          extractMessagesFilePath(file)
        );
        await deleteFilesFromBucket("messages", chatAttachmentsFilePath);
      }

      await db.delete(chat).where(eq(chat.userId, userId));
    }

    const publicComments = await db
      .select()
      .from(streamComment)
      .where(eq(streamComment.userId, userId));

    if (publicComments.length) {
      const attachments = publicComments
        .map((comment) => comment.attachment)
        .filter((attachment) => attachment !== null);

      if (attachments.length) {
        const commentAttachmentsFilePath: string[] = attachments.map((file) =>
          extractCommentFilePath(file)
        );
        await deleteFilesFromBucket("comments", commentAttachmentsFilePath);
      }

      await db.delete(streamComment).where(eq(streamComment.userId, userId));
    }

    const privateComments = await db
      .select()
      .from(streamComment)
      .where(eq(streamComment.userId, userId));

    if (privateComments.length) {
      const attachments = privateComments
        .map((comment) => comment.attachment)
        .filter((attachment) => attachment !== null);

      if (attachments.length) {
        const commentAttachmentsFilePath: string[] = attachments.map((file) =>
          extractCommentFilePath(file)
        );
        await deleteFilesFromBucket("comments", commentAttachmentsFilePath);
      }

      await db
        .delete(streamPrivateComment)
        .where(eq(streamPrivateComment.userId, userId));
    }

    const currentStreams = await db
      .select()
      .from(stream)
      .where(eq(stream.userId, userId));

    if (currentStreams.length) {
      for (const currentStream of currentStreams) {
        const [currentClassroom] = await db
          .select()
          .from(classroom)
          .where(eq(classroom.id, currentStream.classId));

        if (
          !(currentStream.userId === userId || classroom.teacherId === userId)
        ) {
          continue;
        }
      }

      await db.delete(stream).where(eq(stream.userId, userId));
    }

    await db.delete(notification).where(eq(notification.userId, userId));

    if (!currentUser.image.startsWith("https://lh3.googleusercontent.com/")) {
      const filePath = extractAvatarFilePath(currentUser.image);
      await deleteFileFromBucket("avatars", filePath);
    }

    return res.status(200).send({
      message: "User's associated data have been successfully deleted",
      data: null,
      statusCode: 200,
    });
  } catch (error) {
    return res.status(500).send({
      message:
        error instanceof Error
          ? error.message
          : "There was an error deleting the user account.",
      error: "Internal Server Error",
      statusCode: 500,
    });
  }
}

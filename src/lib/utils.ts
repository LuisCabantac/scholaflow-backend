import { config } from "dotenv";

import { supabase } from "./supabase";
import { EmailType } from "./schema";

config({ path: ".env.local" });

export function generateEmailTemplate(
  to_email: string,
  to_name: string,
  token: string,
  emailType: EmailType
) {
  if (emailType === "sign-up") {
    return {
      to_email,
      to_name: to_name.split(" ")[0],
      message: `${process.env.FRONTEND_APP_URL}/verify?token=${token}`,
    };
  }

  if (emailType === "close-account") {
    return {
      to_email,
      to_name: to_name.split(" ")[0],
      email_subject: "Confirm Your ScholaFlow Account Deletion",
      email_title: "Account Closure Request",
      email_description:
        "We received a request to close your ScholaFlow account. If this was you, please click the button below to confirm and permanently delete your account:",
      button_color: "#dc2626",
      button_text: "Confirm Account Closure",
      warning_message:
        "This action cannot be undone. All your data will be permanently deleted.",
      action_url: `${process.env.FRONTEND_APP_URL}/close-account?token=${token}`,
      footer_message:
        "If you didn't request this account closure, please ignore this email or contact our support team.",
    };
  }

  if (emailType === "forgot-password") {
    return {
      to_email,
      to_name: to_name.split(" ")[0],
      email_subject: "Reset Your ScholaFlow Password",
      email_title: "Password Reset Request",
      email_description:
        "We received a request to reset your ScholaFlow account password. If this was you, please click the button below to reset your password:",
      button_color: "#2563eb",
      button_text: "Reset Password",
      action_url: `${process.env.FRONTEND_APP_URL}/reset-password?token=${token}`,
      footer_message:
        "If you didn't request this password reset, please ignore this email or contact our support team. This link will expire in 1 day.",
    };
  }

  throw new Error(`Unsupported email type: ${emailType}`);
}

export async function deleteFilesFromBucket(
  bucketName: string,
  filePath: string[]
) {
  const { error } = await supabase.storage.from(bucketName).remove(filePath);

  if (error)
    throw new Error(
      `${filePath} cannot be deleted from the ${bucketName} bucket`
    );
}

export async function deleteFileFromBucket(
  bucketName: string,
  filePath: string
) {
  const { error } = await supabase.storage.from(bucketName).remove([filePath]);

  if (error)
    throw new Error(
      `${filePath} cannot be deleted from the ${bucketName} bucket`
    );
}

export function extractImagePath(url: string): string {
  const match = url.match(/\/([^\/]+)$/);
  return match ? match[1] : "";
}

export function extractCommentFilePath(url: string): string {
  const match = url.match(/\/comments\/(.+)/);
  return match![1];
}

export function extractNoteFilePath(url: string): string {
  const match = url.match(/\/notes\/(.+)/);
  return match![1];
}

export function extractAvatarFilePath(url: string): string {
  const match = url.match(/\/avatars\/(.+)/);
  return match![1];
}

export function extractStreamFilePath(url: string): string {
  const match = url.match(/\/streams\/(.+)/);
  return match![1];
}

export function extractClassworkFilePath(url: string): string {
  const match = url.match(/\/classworks\/(.+)/);
  return match![1];
}

export function extractMessagesFilePath(url: string): string {
  const match = url.match(/\/messages\/(.+)/);
  return match![1];
}

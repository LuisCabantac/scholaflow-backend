import { eq } from "drizzle-orm";

import { db } from "../drizzle";
import { notification } from "../drizzle/schema";

export async function deleteAllNotificationsByResourceId(resourceId: string) {
  await db.delete(notification).where(eq(notification.resourceId, resourceId));
}

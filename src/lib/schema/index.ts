import { z } from "zod/v4";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.union([z.literal("user"), z.literal("admin")]),
  schoolName: z.nullable(z.string()),
});

export type User = z.infer<typeof userSchema>;

export const editUserSchema = userSchema.omit({
  id: true,
  emailVerified: true,
  createdAt: true,
  role: true,
});

export const accountSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  providerId: z.string(),
  userId: z.string(),
  accessToken: z.nullable(z.string()),
  refreshToken: z.nullable(z.string()),
  idToken: z.nullable(z.string()),
  accessTokenExpiresAt: z.nullable(z.date()),
  refreshTokenExpiresAt: z.nullable(z.date()),
  scope: z.nullable(z.string()),
  password: z.nullable(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Account = z.infer<typeof accountSchema>;

export const sessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  emailVerified: z.boolean(),
  image: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.string(),
  schoolName: z.string().optional().nullable(),
});

export type Session = z.infer<typeof sessionSchema>;

export const verificationSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  value: z.email(),
  expiresAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.nullable(z.date()),
});

export type Verification = z.infer<typeof verificationSchema>;

export const notificationType = z.union([
  z.literal("stream"),
  z.literal("assignment"),
  z.literal("quiz"),
  z.literal("question"),
  z.literal("material"),
  z.literal("comment"),
  z.literal("join"),
  z.literal("addToClass"),
  z.literal("submit"),
  z.literal("grade"),
]);

export type NotificationType = z.infer<typeof notificationType>;

export const notificationSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  type: notificationType,
  fromUserName: z.string(),
  fromUserImage: z.string(),
  resourceId: z.uuid(),
  resourceContent: z.string(),
  resourceUrl: z.string(),
  isRead: z.boolean(),
  createdAt: z.date(),
});

export type Notification = z.infer<typeof notificationSchema>;

export const createNotificationSchema = notificationSchema.omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export const readNotificationSchema = notificationSchema.omit({
  isRead: true,
});

export const roleRequestSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  userName: z.string(),
  userEmail: z.string(),
  userImage: z.string(),
  status: z.union([z.literal("pending"), z.literal("rejected")]),
  createdAt: z.date(),
});

export type RoleRequest = z.infer<typeof roleRequestSchema>;

export const createRoleRequestSchema = roleRequestSchema.omit({
  id: true,
  createdAt: true,
});

export const editRoleRequestSchema = roleRequestSchema.omit({
  id: true,
  userId: true,
  userName: true,
  userEmail: true,
  userImage: true,
  createdAt: true,
});

export const classroomSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  subject: z.nullable(z.string()),
  section: z.string(),
  description: z.nullable(z.string()),
  room: z.nullable(z.string()),
  code: z.string(),
  cardBackground: z.string(),
  teacherId: z.string(),
  teacherName: z.string(),
  teacherImage: z.string(),
  illustrationIndex: z.number(),
  allowUsersToComment: z.boolean(),
  allowUsersToPost: z.boolean(),
  createdAt: z.date(),
});

export type Classroom = z.infer<typeof classroomSchema>;

export const classroomType = z.union([
  z.literal("created"),
  z.literal("enrolled"),
]);

export const createClassroomSchema = classroomSchema.omit({
  id: true,
  description: true,
  allowUsersToComment: true,
  allowUsersToPost: true,
  createdAt: true,
});

export const enrolledClassSchema = z.object({
  id: z.uuid(),
  classId: z.uuid(),
  userId: z.string(),
  userName: z.string(),
  userImage: z.string(),
  name: z.string(),
  subject: z.nullable(z.string()),
  section: z.string(),
  teacherName: z.string(),
  teacherImage: z.string(),
  cardBackground: z.string(),
  illustrationIndex: z.number(),
  createdAt: z.date(),
});

export type EnrolledClass = z.infer<typeof enrolledClassSchema>;

export const createEnrolledClassSchema = enrolledClassSchema.omit({
  id: true,
  createdAt: true,
});

export const classworkSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  userName: z.string(),
  userImage: z.string(),
  classId: z.uuid(),
  className: z.string(),
  streamId: z.uuid(),
  title: z.nullable(z.string()),
  attachments: z.array(z.string()),
  links: z.array(z.string()),
  points: z.nullable(z.number()),
  isGraded: z.boolean(),
  isReturned: z.boolean(),
  streamCreatedAt: z.date(),
  isTurnedIn: z.boolean(),
  turnedInDate: z.nullable(z.date()),
  createdAt: z.date(),
});

export type Classwork = z.infer<typeof classworkSchema>;

export const createClassworkSchema = classworkSchema.omit({
  id: true,
  createdAt: true,
});

export const classTopicSchema = z.object({
  id: z.uuid(),
  classId: z.uuid(),
  name: z.string(),
  createdAt: z.date(),
});

export type ClassTopic = z.infer<typeof classTopicSchema>;

export const createClassTopicSchema = classTopicSchema.omit({
  id: true,
  createdAt: true,
});

export const editClassTopicSchema = classTopicSchema.omit({
  id: true,
  classId: true,
  createdAt: true,
});

export const streamType = z.union([
  z.literal("stream"),
  z.literal("assignment"),
  z.literal("quiz"),
  z.literal("question"),
  z.literal("material"),
]);

export type StreamType = z.infer<typeof streamType>;

export const streamSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  userName: z.string(),
  userImage: z.string(),
  classId: z.uuid(),
  className: z.string(),
  title: z.nullable(z.string()),
  content: z.nullable(z.string()),
  type: streamType,
  attachments: z.array(z.string()),
  links: z.array(z.string()),
  points: z.nullable(z.number()),
  isPinned: z.boolean(),
  acceptingSubmissions: z.boolean(),
  closeSubmissionsAfterDueDate: z.boolean(),
  announceTo: z.array(z.string()),
  announceToAll: z.boolean(),
  topicId: z.nullable(z.uuid()),
  topicName: z.nullable(z.string()),
  dueDate: z.nullable(z.date()),
  createdAt: z.date(),
  updatedAt: z.nullable(z.date()),
  scheduledAt: z.nullable(z.date()),
});

export type Stream = z.infer<typeof streamSchema>;

export const createStreamSchema = streamSchema.omit({
  id: true,
  isPinned: true,
  createdAt: true,
  updatedAt: true,
});

export const editStreamSchema = streamSchema.omit({
  id: true,
  userId: true,
  userName: true,
  userImage: true,
  classId: true,
  className: true,
  type: true,
  isPinned: true,
  createdAt: true,
});

export const streamCommentSchema = z.object({
  id: z.uuid(),
  streamId: z.uuid(),
  classId: z.uuid(),
  userId: z.string(),
  userName: z.string(),
  userImage: z.string(),
  content: z.nullable(z.string()),
  attachment: z.nullable(z.string()),
  createdAt: z.date(),
  updatedAt: z.nullable(z.date()),
});

export type StreamComment = z.infer<typeof streamCommentSchema>;

export const createStreamCommentSchema = streamCommentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const editStreamCommentSchema = streamCommentSchema.omit({
  createdAt: true,
});

export const streamPrivateCommentSchema = z.object({
  id: z.uuid(),
  streamId: z.uuid(),
  classId: z.uuid(),
  userId: z.string(),
  userName: z.string(),
  userImage: z.string(),
  content: z.nullable(z.string()),
  attachment: z.nullable(z.string()),
  createdAt: z.date(),
  updatedAt: z.nullable(z.date()),
  toUserId: z.string(),
});

export type StreamPrivateComment = z.infer<typeof streamPrivateCommentSchema>;

export const createStreamPrivateCommentSchema = streamPrivateCommentSchema.omit(
  { id: true, createdAt: true, updatedAt: true }
);

export const editStreamPrivateCommentSchema = streamPrivateCommentSchema.omit({
  id: true,
  createdAt: true,
});

export const noteSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  title: z.nullable(z.string()),
  content: z.nullable(z.string()),
  attachments: z.array(z.string()),
  isPinned: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.nullable(z.date()),
});

export type Note = z.infer<typeof noteSchema>;

export const createNoteSchema = noteSchema.omit({ id: true, createdAt: true });

export const editNoteSchema = noteSchema.omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const chatSchema = z.object({
  id: z.uuid(),
  userId: z.string(),
  userName: z.string(),
  userImage: z.string(),
  classId: z.uuid(),
  message: z.nullable(z.string()),
  attachments: z.array(z.string()),
  createdAt: z.date(),
});

export type Chat = z.infer<typeof chatSchema>;

export const createChatSchema = chatSchema.omit({ id: true, createdAt: true });

export const nanoidId = z.nanoid();

export const uuidv4Id = z.uuidv4();

export const signInFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be no more than 20 characters long" }),
});

export const fullNameSchema = z
  .string()
  .min(2, { message: "Name must be at least 2 characters long" })
  .max(50, { message: "Name must be no more than 50 characters long" })
  .regex(/^[a-zA-Z\s'-]+$/, {
    message: "Name can only contain letters, spaces, hyphens, and apostrophes",
  })
  .refine((name) => name.trim().split(/\s+/).length >= 2, {
    message: "Please enter both first and last name",
  });

export const signUpFormSchema = z.object({
  fullName: fullNameSchema,
  email: z.email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be no more than 20 characters long" }),
  agreeToPolicy: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and privacy policy",
  }),
});

export const forgetPasswordFormSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
});

export const resetPasswordFormSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be no more than 20 characters long" }),
});

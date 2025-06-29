import { Router, Request, Response, NextFunction } from "express";

import {
  createClassroom,
  getClassByClassId,
} from "../controllers/classroomsController";

const router = Router();

router.get(
  "/:classId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getClassByClassId(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createClassroom(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;

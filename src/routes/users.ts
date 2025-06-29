import { Router, Request, Response, NextFunction } from "express";

import { getAllClasses } from "../controllers/classroomsController";
import { getUserById, getUserByEmail } from "../controllers/usersController";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getUserByEmail(req, res);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getUserById(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:userId/classrooms",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllClasses(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

import { Router, Request, Response, NextFunction } from "express";

import { getUserById, getUserByEmail } from "../controllers/usersController";
import { getAllCreatedClasses } from "../controllers/classroomsController";

const router = Router();

router.get(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllCreatedClasses(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:classId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getUserById(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

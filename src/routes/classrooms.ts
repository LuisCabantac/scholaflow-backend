import { Router, Request, Response, NextFunction } from "express";

import { getAllClasses } from "../controllers/classroomsController";

const router = Router();

router.get(
  "/:classId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllClasses(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

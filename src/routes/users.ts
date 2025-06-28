import { Router, Request, Response, NextFunction } from "express";

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

export default router;

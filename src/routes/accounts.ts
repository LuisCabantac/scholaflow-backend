import { Router, Request, Response, NextFunction } from "express";

import {
  deleteUser,
  getAccountByUserId,
} from "../controllers/accountsController";

const router = Router();

router.get(
  "/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAccountByUserId(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.delete("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteUser(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;

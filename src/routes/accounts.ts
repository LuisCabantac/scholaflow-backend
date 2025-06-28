import { Router, Request, Response, NextFunction } from "express";

import { getAccountByUserId } from "../controllers/accountsController";

const router = Router();

router.get(
  "/accounts/:userId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAccountByUserId(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;

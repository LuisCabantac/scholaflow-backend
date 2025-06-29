import { Router, Request, Response, NextFunction } from "express";

import {
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

    } catch (error) {
      next(error);
    }
  }
);

export default router;

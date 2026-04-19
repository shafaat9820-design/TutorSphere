import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import postsRouter from "./posts";
import applicationsRouter from "./applications";
import paymentsRouter from "./payments";
import reportsRouter from "./reports";
import adminRouter from "./admin";
import { generalLimiter } from "../middleware/rateLimiter";

const router: IRouter = Router();

router.use(generalLimiter);

router.use(healthRouter);
router.use(authRouter);
router.use(postsRouter);
router.use(applicationsRouter);
router.use(paymentsRouter);
router.use(reportsRouter);
router.use(adminRouter);

export default router;

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth.js";
import postsRouter from "./posts.js";
import applicationsRouter from "./applications.js";
import paymentsRouter from "./payments.js";
import reportsRouter from "./reports.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(postsRouter);
router.use(applicationsRouter);
router.use(paymentsRouter);
router.use(reportsRouter);
router.use(adminRouter);

export default router;

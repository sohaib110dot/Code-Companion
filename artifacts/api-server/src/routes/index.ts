import { Router, type IRouter } from "express";
import healthRouter from "./health";
import converterRouter from "./converter";

const router: IRouter = Router();

router.use(healthRouter);
router.use(converterRouter);

export default router;

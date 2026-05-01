import { Router } from "express";
import { getApprovalByToken, decideApproval } from "../controllers/approvals.controllers.js";

const router = Router();

// Public by token (decision will be gated in UI by login if needed)
router.get("/:token", getApprovalByToken);
router.post("/:token/decide", decideApproval);

export default router;

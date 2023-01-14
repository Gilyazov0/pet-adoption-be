import { Router } from "express";
import { auth, isAdmin } from "../middleware/userMiddleware";
import validateBody from "../middleware/validateBody";
import issueSchema from "../Schemas/issueSchema";
import ContactUsController from "../controller/contactUs";
import commentSchema from "../Schemas/commentSchema";

const router = Router();

router
  .route("/")
  .post(auth, validateBody(issueSchema), ContactUsController.addIssue)
  .get(isAdmin, ContactUsController.getAllIssues)
  .delete(isAdmin, validateBody(issueSchema), ContactUsController.delIssue);

router.post(
  "/addComment",
  isAdmin,
  validateBody(commentSchema),
  ContactUsController.addComment
);

export default router;

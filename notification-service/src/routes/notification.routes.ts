import { Router } from "express";
import {
  createNotification,
  getanNotification,
  updateData,
  notificationDelete,
  getNotification,
  getAllReadNotifications,
  getAllUnreadNotifications
} from "../controllers/notification.controllers";
import { authenticate } from "../middleware/authenticate";
import { validate, validateParams } from "../middleware/validate.middleware";
import {
  createNotificationSchema,
  updateNotificationSchema,
  getByRoleParamsSchema
} from "../validations/notification.validation";

const router = Router();

// Apply authentication to all routes
router.use(authenticate);

// CRUD
router.post(
  "/notification",
  authenticate,
  validate(createNotificationSchema),
  createNotification
);

router.get("/notification", authenticate, getNotification);

router.get("/notification/:id", authenticate, getanNotification);

router.put(
  "/notification/:id",
  authenticate,
  validate(updateNotificationSchema),
  updateData
);

router.delete("/notification/:id", notificationDelete);

router.get(
  "/notification/unread/:id/:role",
  authenticate,
  validateParams(getByRoleParamsSchema),
  getAllUnreadNotifications
);

router.get(
  "/notification/read/:id/:role",
  authenticate,
  validateParams(getByRoleParamsSchema),
  getAllReadNotifications
);

export default router;






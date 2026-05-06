import { Router } from "express";
import {
createRolepermission,
getRolepermission,
getanRolepermission,
rolepermissionDelete,
updateData
 
} from "../controllers/rolepermission.controllers";
import { authenticate } from "../middleware/authenticate";
import { checkPermission } from "../middleware/role.middleware";

const router = Router();




// CRUD

router.post("/rolepermission", authenticate, checkPermission("permission", "create"),  createRolepermission);
router.get("/rolepermission", authenticate, checkPermission("permission", "view"),  getRolepermission);
router.get("/rolepermission/:id", authenticate, checkPermission("permission", "view"),  getanRolepermission);
router.put("/rolepermission/:id", authenticate, checkPermission("permission", "edit"),  updateData);
router.delete("/rolepermission/:id", authenticate, checkPermission("permission", "delete"),  rolepermissionDelete);

export default router;
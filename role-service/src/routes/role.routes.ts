import { Router } from "express";
import {
createRole,
getRole,
getanRole,
roleDelete,
updateData
 
} from "../controllers/role.controllers";
import { authenticate } from "../middleware/authenticate";
import { checkPermission } from "../middleware/role.middleware";

const router = Router();




// CRUD

router.post("/role", authenticate, checkPermission("permission", "create"),   createRole);
router.get("/role", authenticate, checkPermission("permission", "view"),  getRole);
router.get("/role/:id", authenticate, checkPermission("permission", "view"),  getanRole);
router.put("/role/:id", authenticate, checkPermission("permission", "edit"),  updateData);
router.delete("/role/:id", authenticate, checkPermission("permission", "delete"),  roleDelete);

export default router;
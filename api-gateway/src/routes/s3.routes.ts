import express from "express";
import { proxyRequest } from "../services/s3.service";

const router = express.Router();

// Proxy all requests starting with /users, /patients, or /vitals to the user-service
router.use("/presignurl", proxyRequest);



export default router;



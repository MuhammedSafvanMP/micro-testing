import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { S3 } from "../lib/S3Client";
import axios from "axios";

dotenv.config();

export const createPresignurl = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      

      const { filename, contentType, size, service, id } = req.body;

      if (!filename || !contentType || !size) {
        res.status(400).json({ error: "Invalid request body" });
      }

      const uniqueKey = `${uuidv4()}-${filename}`;

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: uniqueKey,
        ContentType: contentType,
        ContentLength: size,
      });

      const presignedUrl = await getSignedUrl(S3, command, {
        expiresIn: 360,
      });

      if (decoded?.role === "user") {
          await axios.post(
          `${process.env.USER_SERVICE_URL}/users/${decoded.id}`,
          {
            picture: uniqueKey,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      if (decoded?.role === "staff") {
          await axios.post(
          `${process.env.STAFF_SERVICE_URL}/staff/${decoded.id}`,
          {
            picture: uniqueKey,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      if (decoded?.role === "doctor") {
          await axios.post(
          `${process.env.DOCTOR_SERVICE_URL}/doctor/${decoded.id}`,
          {
            picture: uniqueKey,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      if (decoded?.role === "hospital") {
        await axios.post(
          `${process.env.HOSPITAL_SERVICE_URL}/hospital/${decoded.id}`,
          {
            picture: uniqueKey,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      if (service === "ad") {

          await axios.post(
          `${process.env.ADS_SERVICE_URL}/ad/${id}`,
          {
            imageUrl: uniqueKey,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );

      }

      if (service === "speciality") {
          await axios.post(
          `${process.env.SPECIALITY_SERVICE_URL}/speciality/${id}`,
          {
            picture: uniqueKey,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      res.json({
        presignedUrl,
        key: uniqueKey,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  },
);

export const editAPresignurl: any = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      // ✅ Express way
      const { filename, contentType, key, service, id} = req.body;

        const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      

      if (!filename || !contentType) {
        res.status(400).json({
          error: "Missing filename or contentType",
        });
      }

      // reuse key OR create new
      const objectKey = key || `${Date.now()}-${filename.replace(/\s/g, "-")}`;

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: objectKey,
        ContentType: contentType,
      });

      const presignedUrl = await getSignedUrl(S3, command, {
        expiresIn: 60 * 5,
      });


      if (decoded?.role === "user") {
          await axios.post(
          `${process.env.USER_SERVICE_URL}/users/${decoded.id}`,
          {
            picture: objectKey,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      if (decoded?.role === "staff") {
          await axios.post(
          `${process.env.STAFF_SERVICE_URL}/staff/${decoded.id}`,
          {
            picture: objectKey,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      if (decoded?.role === "doctor") {
          await axios.post(
          `${process.env.DOCTOR_SERVICE_URL}/doctor/${decoded.id}`,
          {
            picture: objectKey,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      if (decoded?.role === "hospital") {
        await axios.post(
          `${process.env.HOSPITAL_SERVICE_URL}/hospital/${decoded.id}`,
          {
            picture: objectKey,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      if (service === "ad") {

          await axios.post(
          `${process.env.ADS_SERVICE_URL}/ad/${id}`,
          {
            imageUrl: objectKey,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );

      }

      if (service === "speciality") {
          await axios.post(
          `${process.env.SPECIALITY_SERVICE_URL}/speciality/${id}`,
          {
            picture: objectKey,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }


      res.json({
        presignedUrl,
        key: objectKey,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Failed to create edit URL",
      });
    }
  },
);

export const deleteAPresignurl: any = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      // ✅ Express way
      const { key, service, id } = req.body;


        const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      if (!key || typeof key !== "string") {
        res.status(400).json({
          error: "Missing or invalid object key.",
        });
      }

      const command = new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      });

      await S3.send(command);


      if (decoded?.role === "user") {
          await axios.post(
          `${process.env.USER_SERVICE_URL}/users/${decoded.id}`,
          {
            picture: null,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      if (decoded?.role === "staff") {
          await axios.post(
          `${process.env.STAFF_SERVICE_URL}/staff/${decoded.id}`,
          {
            picture: null,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      if (decoded?.role === "doctor") {
          await axios.post(
          `${process.env.DOCTOR_SERVICE_URL}/doctor/${decoded.id}`,
          {
            picture: null,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      if (decoded?.role === "hospital") {
        await axios.post(
          `${process.env.HOSPITAL_SERVICE_URL}/hospital/${decoded.id}`,
          {
            picture: null,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      if (service === "ad") {

          await axios.post(
          `${process.env.ADS_SERVICE_URL}/ad/${id}`,
          {
            imageUrl: null,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );

      }

      if (service === "speciality") {
          await axios.post(
          `${process.env.SPECIALITY_SERVICE_URL}/speciality/${id}`,
          {
            picture: null,
          },
          {
            headers: {
              Authorization: req.headers.authorization,
            },
          },
        );
      }

      res.status(200).json({
        message: "File deleted successfully",
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        error: "Failed to delete file.",
      });
    }
  },
);

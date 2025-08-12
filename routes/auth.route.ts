import { Request, Response } from "express";
import { Router } from "express";
import { addCodeWithGoogleAuthorization, addTokensWithCode } from "../controllers/auth.controller.js";
import multer from "multer";

const routerAuth = Router();
const upload = multer({ dest: 'tmp/' });

routerAuth.get('/google', upload.any(), addCodeWithGoogleAuthorization);
routerAuth.get('/oauth2callback', upload.any(), addTokensWithCode);

export default routerAuth;
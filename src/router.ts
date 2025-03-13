import { Router } from "express";
import { body } from "express-validator";
import { createAccount } from "./handlers";

const router = Router();

//  Autentication and register
router.post(
  "/auth/register",
  body("handle").notEmpty().withMessage("El handle no puede estar vacío"),
  body("name").notEmpty().withMessage("El nombre no puede estar vacío"),
  body("email").isEmail().withMessage("E-mail no válido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, minimo 8 caracteres"),

  createAccount
);

export default router;

import { Router } from "express";
import { body } from "express-validator";
import { createAccount, getUser, getUserByHandle, login, updateProfile, uploadImage } from "./handlers";
import { handleInputErrors } from "./middleware/validation";
import { authenticate } from "./middleware/auth";

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
  handleInputErrors,
  createAccount
);

router.post(
  "/auth/login",
  body("email").isEmail().withMessage("E-mail no válido"),
  body("password").notEmpty().withMessage("El password es obligatorio"),
  handleInputErrors,
  login
);

// autenticado
router.get("/user", authenticate, getUser);
router.patch(
  "/user",
  body("handle").notEmpty().withMessage("El handle no puede estar vacío"),
  body("description")
    .notEmpty()
    .withMessage("La descripción no puede estar vacío"),
  handleInputErrors,
  authenticate,
  updateProfile
);

router.post("/user/image", authenticate,uploadImage)

router.get("/:handle",getUserByHandle)

export default router;

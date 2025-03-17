import { Request, Response } from "express";
import slug from "slug";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { validationResult } from "express-validator";
import { generateJWT } from "../utils/jwt";

export const createAccount = async (req: Request, res: Response) => {
  //__________________________________ / Importación dinámica de slug
  const slug = await import("slug").then((module) => module.default);

  const { email, password } = req.body;

  const userExist = await User.findOne({ email });
  if (userExist) {
    const error = new Error("Un usuario con ese email ya esta registrado"); //usuario pueda resolver un conflicto y volver a enviar la solicitud.
    res.status(409).json({ error: error.message });
    return;
  }

  const handle = slug(req.body.handle, "");
  const handleExist = await User.findOne({ handle });
  if (handleExist) {
    const error = new Error("Nombre de usuario (handle) no disponible");
    res.status(409).json({ error: error.message });
    return;
  }

  const user = new User(req.body);
  user.password = await hashPassword(password);
  user.handle = handle;

  await user.save();
  res.status(201).send("Registro creado correctamente");
};

export const login = async (req: Request, res: Response) => {
  // Manejar errores de validación
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  // Revisar si el usuario esta registrado
  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("El Usuario no existe"); //usuario pueda resolver un conflicto y volver a enviar la solicitud.
    res.status(404).json({ error: error.message });
    return;
  }

  // Comparar el password
  const isPasswordCorrect = await checkPassword(password, user.password);
  if (!isPasswordCorrect) {
    const error = new Error("Password Incorrecto");
    res.status(401).json({ error: error.message });
    return;
  }

  const token = generateJWT({ id: user._id });

  res.send(token);
};

export const getUser = async (req: Request, res: Response) => {
  res.json(req.user);
};

export const updateProfile = async (req: Request, res: Response) => {
  const slug = await import("slug").then((module) => module.default);

  try {
    const { description } = req.body;
    const handle = slug(req.body.handle, "");
    const handleExist = await User.findOne({ handle });
    // Realiza para que handle no interactue con otros usuarion no autorizados
    if (handleExist && handleExist.email !== req.user.email) {
      const error = new Error("Nombre de usuario (handle) no disponible");
      res.status(409).json({ error: error.message });
      return;
    }

    // Actualizar el usuario
    req.user.description = description;
    req.user.handle = handle;
    await req.user.save();
    res.send("Perfil Actualizado Correctamente");
  } catch (e) {
    const error = new Error("Hubo un error");
    res.status(500).json({ error: error.message });
    return;
  }
};

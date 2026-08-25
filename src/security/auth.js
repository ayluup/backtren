import jwt from "jsonwebtoken";
import { SECRET } from "./jwt.js";
import { getUserByIdService } from "../services/user.service.js";

export const verificarToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ mensaje: "No se envió un token válido." });
        }

        const payload = jwt.verify(authHeader.slice(7), SECRET);
        const usuario = await getUserByIdService(payload.id);

        if (!usuario) {
            return res.status(401).json({ mensaje: "El usuario no existe." });
        }

        req.usuario = usuario;
        next();
    } catch {
        return res.status(401).json({ mensaje: "Token inválido o expirado." });
    }
};

export const permitirRoles = (...rolesPermitidos) => (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({ mensaje: "Usuario no autenticado." });
    }

    if (!rolesPermitidos.includes(req.usuario.role)) {
        return res.status(403).json({ mensaje: "No tienes permisos para realizar esta acción." });
    }

    next();
};
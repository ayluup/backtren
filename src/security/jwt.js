import jwt from "jsonwebtoken";

const SECRET = "mi_clave_secreta";

export const generarToken = (user) => {

  return jwt.sign(

    {
      id: user.id,
      role: user.role,
    },

    SECRET,

    {
      expiresIn: "2h",
    }

  );
};

export { SECRET };
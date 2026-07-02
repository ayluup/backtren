import {
  checkHealth,
  checkDbHealth,
} from "../services/health.service.js";


export const health = (req, res) => {
  res.status(200).json(checkHealth());
};

export const dbHealth = async (req, res) => {
  const result = await checkDbHealth();
  res.status(200).json(result);
};
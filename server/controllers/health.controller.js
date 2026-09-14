import { sendSuccess } from "../utils/apiResponse.js";

export const getHealth = (req, res) => {
  sendSuccess(res, {
    message: "Personal Student OS API is running",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
  });
};

export default getHealth;

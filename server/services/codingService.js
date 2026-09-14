import CodingSession from "../models/CodingSession.js";
import { createCrudService } from "./crudService.js";

export default createCrudService(CodingSession, "CodingSession");

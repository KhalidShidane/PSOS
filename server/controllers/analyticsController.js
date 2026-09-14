import analyticsService from "../services/analyticsService.js";
import { sendSuccess } from "../utils/apiResponse.js";

export const getDashboard = async (req, res, next) => {
  try {
    const data = await analyticsService.getDashboard(req.user.id);
    sendSuccess(res, { message: "Dashboard data retrieved", data });
  } catch (err) {
    next(err);
  }
};

export const getStudyAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getStudyAnalytics(req.user.id, req.query.period);
    sendSuccess(res, { message: "Study analytics retrieved", data });
  } catch (err) {
    next(err);
  }
};

export const getTaskAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getTaskAnalytics(req.user.id, req.query.period);
    sendSuccess(res, { message: "Task analytics retrieved", data });
  } catch (err) {
    next(err);
  }
};

export const getAssignmentAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getAssignmentAnalytics(req.user.id, req.query.period);
    sendSuccess(res, { message: "Assignment analytics retrieved", data });
  } catch (err) {
    next(err);
  }
};

export const getCodingAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getCodingAnalytics(req.user.id, req.query.period);
    sendSuccess(res, { message: "Coding analytics retrieved", data });
  } catch (err) {
    next(err);
  }
};

export const getFinanceAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getFinanceAnalytics(req.user.id, req.query.period);
    sendSuccess(res, { message: "Finance analytics retrieved", data });
  } catch (err) {
    next(err);
  }
};

export const getCourseAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getCourseAnalytics(req.user.id);
    sendSuccess(res, { message: "Course analytics retrieved", data });
  } catch (err) {
    next(err);
  }
};

export const getWeeklyAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getWeeklyAnalytics(req.user.id, req.query.weekStart);
    sendSuccess(res, { message: "Weekly analytics retrieved", data });
  } catch (err) {
    next(err);
  }
};

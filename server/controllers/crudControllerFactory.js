import { sendSuccess } from "../utils/apiResponse.js";

/**
 * Wraps a user-scoped CRUD service (see services/crudService.js) into
 * Express request handlers, so individual controller files stay thin
 * declarations rather than repeating the same try/catch/response
 * boilerplate for every resource.
 */
export const createCrudController = (service, resourceName = "Resource") => {
  const create = async (req, res, next) => {
    try {
      const doc = await service.create(req.user.id, req.body);
      sendSuccess(res, { statusCode: 201, message: `${resourceName} created`, data: doc });
    } catch (err) {
      next(err);
    }
  };

  const getAll = async (req, res, next) => {
    try {
      const docs = await service.getAll(req.user.id);
      sendSuccess(res, { message: `${resourceName} list retrieved`, data: docs });
    } catch (err) {
      next(err);
    }
  };

  const getById = async (req, res, next) => {
    try {
      const doc = await service.getById(req.user.id, req.params.id);
      sendSuccess(res, { message: `${resourceName} retrieved`, data: doc });
    } catch (err) {
      next(err);
    }
  };

  const update = async (req, res, next) => {
    try {
      const doc = await service.update(req.user.id, req.params.id, req.body);
      sendSuccess(res, { message: `${resourceName} updated`, data: doc });
    } catch (err) {
      next(err);
    }
  };

  const remove = async (req, res, next) => {
    try {
      await service.remove(req.user.id, req.params.id);
      sendSuccess(res, { message: `${resourceName} deleted`, data: {} });
    } catch (err) {
      next(err);
    }
  };

  return { create, getAll, getById, update, remove };
};

export default createCrudController;

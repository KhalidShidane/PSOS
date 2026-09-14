import { ApiError } from "../utils/ApiError.js";

/**
 * Builds user-scoped CRUD operations for a Mongoose model. Every query is
 * filtered by `user`, so one user's data is never visible to (or editable
 * by) another - the isolation boundary that authentication (Step 3) will
 * sit in front of.
 *
 * update() fetches the document and calls `.save()` rather than using
 * findOneAndUpdate, so schema-level document middleware (pre('validate'),
 * pre('save') - e.g. Task's completedAt sync, StudySession's duration
 * calculation) runs consistently on both create and update.
 */
export const createCrudService = (Model, resourceName = "Resource") => {
  const create = async (userId, data) => {
    const { user: _ignoredUser, _id, ...payload } = data;
    return Model.create({ ...payload, user: userId });
  };

  const getAll = async (userId, filter = {}) => {
    return Model.find({ ...filter, user: userId }).sort({ createdAt: -1 });
  };

  const getById = async (userId, id) => {
    const doc = await Model.findOne({ _id: id, user: userId });
    if (!doc) throw new ApiError(404, `${resourceName} not found`);
    return doc;
  };

  const update = async (userId, id, data) => {
    const doc = await Model.findOne({ _id: id, user: userId });
    if (!doc) throw new ApiError(404, `${resourceName} not found`);

    const { user: _ignoredUser, _id, ...payload } = data;
    Object.assign(doc, payload);
    await doc.save();
    return doc;
  };

  const remove = async (userId, id) => {
    const doc = await Model.findOneAndDelete({ _id: id, user: userId });
    if (!doc) throw new ApiError(404, `${resourceName} not found`);
    return doc;
  };

  return { create, getAll, getById, update, remove };
};

export default createCrudService;

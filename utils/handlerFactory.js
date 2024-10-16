const ApiError = require("../utils/apiError");
const expressAsyncHandler = require("express-async-handler");
const slugify = require("slugify");
const apiFeatures = require("./apiFeatures");

const deleteOne = (Model) =>
  expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`Document not found with id ${id}`, 404));
    }

    await document.deleteOne();

    res.status(204).send();
  });
const updateOne = (Model) =>
  expressAsyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(new ApiError(`document not found ${id}`, 404));
    }
    document.save();
    res.status(200).json(document);
  });

const createOne = (Model) =>
  expressAsyncHandler(async (req, res) => {
    const document = await Model.create(req.body);
    res.status(201).json(document);
  });

const getOne = (Model, populateOptions) =>
  expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const qury = Model.findById(id);
    if (populateOptions) qury.populate(populateOptions);
    const document = await qury;
    if (!document) {
      return next(new ApiError(`document not found ${id}`, 404));
    }
    res.status(200).json(document);
  });

const getAll = (Model, modelName) =>
  expressAsyncHandler(async (req, res) => {
    let query = {};
    if (req.query) {
      query = req.query;
    }
    const documentsCount = await Model.countDocuments();
    const api = new apiFeatures(Model.find(query), req.query)
      .pagination(documentsCount)
      .filter()
      .search(modelName)
      .sort()
      .limitFields();

    const { mongooseQuery, paginationResult } = api;
    const documents = await mongooseQuery;
    res
      .status(200)
      .json({ result: documents.length, paginationResult, documents });
  });

module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
};

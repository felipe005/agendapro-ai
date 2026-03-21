import { serviceCatalogService } from "../services/serviceCatalogService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const serviceCatalogController = {
  list: catchAsync(async (req, res) => {
    const result = await serviceCatalogService.list(req.user.id);
    res.json(result);
  }),

  create: catchAsync(async (req, res) => {
    const result = await serviceCatalogService.create(req.user.id, req.body);
    res.status(201).json(result);
  }),

  update: catchAsync(async (req, res) => {
    const result = await serviceCatalogService.update(req.user.id, req.params.id, req.body);
    res.json(result);
  }),

  remove: catchAsync(async (req, res) => {
    const result = await serviceCatalogService.remove(req.user.id, req.params.id);
    res.json(result);
  })
};

import { clientService } from "../services/clientService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const clientController = {
  create: catchAsync(async (req, res) => {
    const client = await clientService.create(req.user.id, req.body);
    res.status(201).json(client);
  }),

  list: catchAsync(async (req, res) => {
    const clients = await clientService.list(req.user.id);
    res.json(clients);
  }),

  update: catchAsync(async (req, res) => {
    const client = await clientService.update(req.user.id, req.params.id, req.body);
    res.json(client);
  }),

  remove: catchAsync(async (req, res) => {
    const result = await clientService.remove(req.user.id, req.params.id);
    res.json(result);
  })
};


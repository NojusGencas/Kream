import * as projectModel from "../models/project.js";

/* GET project listing. */
export const index = async (req, res, next) => {
  // gauname duomenis iš modelio
  let projects = await projectModel.selectAll();

  res.json(projects);
};

export const show = async (req, res, next) => {
  // gauname duomenis iš modelio
  let project = await projectModel.selectById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "404" });
  }

  res.json(project);
};

export const store = async (req, res, next) => {
  // validacija
  if (!req.body.title || !req.body.description) {
    return res.status(400).json({ message: "Trūksta duomenų" });
  }

  let projectId = await projectModel.insert(req.body);

  // tikrina ar pavyko įterpti
  if (!projectId) {
    return res.status(500).json({ message: "Klaida kuriant projektą" });
  }

  res.status(201).json({ id: projectId });
};

export const update = async (req, res, next) => {
  // validacija
  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.sort_order ||
    !req.body.publish_date
  ) {
    return res.status(400).json({ message: "Trūksta duomenų" });
  }

  let success = await projectModel.update(req.params.id, req.body);

  if (!success) {
    return res.status(500).json({ message: "Klaida atnaujinant projektą" });
  }

  res.json({ message: "Projektas atnaujintas" });
};

export const destroy = async (req, res, next) => {
  let success = await projectModel.destroy(req.params.id);
  if (!success) {
    return res.status(500).json({ message: "Klaida trinant projektą" });
  }

  res.json({ message: "Projektas ištrintas" });
};

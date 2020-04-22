const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateUuid = (req, res, next) => {
  const { id } = req.params;

  if (!isUuid(id)) return res.status(400).json({ error: "Invalid uuid" });

  res.locals.validated = { id };

  return next();
};

const findRepo = async (req, res, next) => {
  const { id } = res.locals.validated;

  const index = await repositories.findIndex((repo) => repo.id === id);

  if (index === -1) res.status(400).json({ error: "Repo not found" });

  res.locals.validated.index = index;

  return next();
};

app.get("/repositories", (req, res) => {
  return res.status(200).json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, techs, url } = req.body;
  const id = uuid();

  const repo = { id, title, techs, url, likes: 0 };

  repositories.push(repo);

  return res.status(200).json(repo);
});

app.put("/repositories/:id", validateUuid, findRepo, (req, res) => {
  const { id, index } = res.locals.validated;
  const { title, techs, url } = req.body;

  const newRepo = { id, title, techs, url, likes: repositories[index].likes };

  repositories[index] = newRepo;

  return res.status(200).json(newRepo);
});

app.delete("/repositories/:id", validateUuid, findRepo, (req, res) => {
  const { index } = res.locals.validated;
  repositories.splice(index, 1);

  return res.sendStatus(204);
});

app.post("/repositories/:id/like", validateUuid, findRepo, (req, res) => {
  const { index } = res.locals.validated;
  repositories[index].likes += 1;

  return res.status(200).json({ likes: repositories[index].likes });
});

module.exports = app;

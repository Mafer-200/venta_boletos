// routes/partido.routes.js
module.exports = app => {
  const partido = require("../controllers/partido.controller.js");

  var router = require("express").Router();

  // Crear un nuevo Partido
  router.post("/create", partido.create);

  // Listar todos los Partidos
  router.get("/", partido.findAll);

  // Obtener un solo Partido por id
  router.get("/:id", partido.findOne);

  // Actualizar un Partido por id
  router.put("/update/:id", partido.update);

  // Eliminar un Partido por id
  router.delete("/delete/:id", partido.delete);

  // Eliminar todos los Partidos
  router.delete("/delete/", partido.deleteAll);

  app.use("/api/partidos", router);
};

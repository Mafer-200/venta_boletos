// routes/localidad.routes.js
module.exports = app => {
  const localidad = require("../controllers/localidad.controller.js");

  var router = require("express").Router();

  // Crear una nueva Localidad
  router.post("/create", localidad.create);

  // Listar todas las Localidades
  router.get("/", localidad.findAll);

  // Obtener una sola Localidad por id_localidad
  router.get("/:id", localidad.findOne);

  // Actualizar una Localidad por id_localidad
  router.put("/update/:id", localidad.update);

  // Eliminar una Localidad por id_localidad
  router.delete("/delete/:id", localidad.delete);

  // Eliminar todas las Localidades
  router.delete("/delete/", localidad.deleteAll);

  // Ejemplo: http://localhost:PUERTO/api/localidades/
  app.use("/api/localidades", router);
};

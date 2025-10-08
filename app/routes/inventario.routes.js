// routes/inventario.routes.js
module.exports = app => {
  const inventario = require("../controllers/inventario.controller.js");

  var router = require("express").Router();

  // Crear un nuevo Inventario
  router.post("/create", inventario.create);

  // Listar todos los Inventarios
  router.get("/", inventario.findAll);

  // Obtener un solo Inventario por id
  router.get("/:id", inventario.findOne);

  // Actualizar un Inventario por id
  router.put("/update/:id", inventario.update);

  // Eliminar un Inventario por id
  router.delete("/delete/:id", inventario.delete);

  // Eliminar todos los Inventarios
  router.delete("/delete/", inventario.deleteAll);


  // Ejemplo: http://localhost:PUERTO/api/inventarios/
  app.use("/api/inventarios", router);
};

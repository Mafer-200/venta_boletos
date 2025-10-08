// routes/venta.routes.js
module.exports = app => {
  const venta = require("../controllers/venta.controller.js");

  var router = require("express").Router();

  // Crear una nueva Venta
  router.post("/create", venta.create);

  // Listar todas las Ventas
  router.get("/", venta.findAll);

  // Obtener una sola Venta por id
  router.get("/:id", venta.findOne);

  // Actualizar una Venta por id
  router.put("/update/:id", venta.update);

  // Eliminar una Venta por id
  router.delete("/delete/:id", venta.delete);

  // Eliminar todas las Ventas
  router.delete("/delete/", venta.deleteAll);

  app.use("/api/ventas", router);
};

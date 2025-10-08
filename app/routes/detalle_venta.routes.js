
module.exports = app => {
  const detalle_venta = require("../controllers/detalle_venta.controller.js");

  var router = require("express").Router();

  // Crear un nuevo Detalle de Venta
  router.post("/create", detalle_venta.create);

  // Listar todos los Detalles de Venta
  router.get("/", detalle_venta.findAll);

  // Obtener un solo Detalle de Venta por id
  router.get("/:id", detalle_venta.findOne);

  // Actualizar un Detalle de Venta por id
  router.put("/update/:id", detalle_venta.update);

  // Eliminar un Detalle de Venta por id
  router.delete("/delete/:id", detalle_venta.delete);

  // Eliminar todos los Detalles de Venta
  router.delete("/delete/", detalle_venta.deleteAll);

  app.use("/api/detalle_ventas", router);
};

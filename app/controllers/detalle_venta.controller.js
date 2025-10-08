
const db = require("../models");
// Nota: ajusta a db.detalle_venta o db.detalle_ventas según cómo lo exportes en models/index.js
const DetalleVenta = db.detalle_ventas; 
const Op = db.Sequelize.Op;

// Create and Save a new DetalleVenta
exports.create = (req, res) => {
  // Validamos que dentro del request no vengan vacíos los campos obligatorios
  const required = ["id_venta", "id_localidad", "id_partido", "cantidad", "precio_unitario"];
  const missing = required.filter(k => req.body[k] === undefined || req.body[k] === null || req.body[k] === "");
  if (missing.length > 0) {
    res.status(400).send({
      message: `Los siguientes campos son obligatorios y no pueden estar vacíos: ${missing.join(", ")}`
    });
    return;
  }

  // Create un DetalleVenta, definiendo una variable con la estructura del request
  const payload = {
    id_venta: req.body.id_venta,
    id_localidad: req.body.id_localidad,
    id_partido: req.body.id_partido,
    cantidad: req.body.cantidad,
    precio_unitario: req.body.precio_unitario
  };

  // Save a new DetalleVenta into the database
  DetalleVenta.create(payload)
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear el detalle de la venta."
      });
    });
};

// Retrieve all DetalleVenta from the database. (filtro opcional por id_venta)
exports.findAll = (req, res) => {
  const id_venta = req.query.id_venta;
  const condition = id_venta ? { id_venta: { [Op.eq]: id_venta } } : null;

  DetalleVenta.findAll({ where: condition })
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los detalles de venta."
      });
    });
};

// Find a single DetalleVenta by id_detalle
exports.findOne = (req, res) => {
  const id = req.params.id; // corresponde a id_detalle

  DetalleVenta.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No se encontró el detalle de venta con id_detalle=${id}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error recuperando detalle de venta con id_detalle=" + id
      });
    });
};

// Update a DetalleVenta by the id in the request
exports.update = (req, res) => {
  const id = req.params.id; // id_detalle

  DetalleVenta.update(req.body, { where: { id_detalle: id } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "El detalle de venta se actualizó correctamente." });
      } else {
        res.send({
          message: `No se pudo actualizar el detalle de venta con id_detalle=${id}. Puede que no exista o req.body esté vacío.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error actualizando el detalle de venta con id_detalle=" + id
      });
    });
};

// Delete a DetalleVenta with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id; // id_detalle

  // utilizamos el método destroy para eliminar el objeto; mandamos la condicionante where id_detalle = parámetro que recibimos
  DetalleVenta.destroy({ where: { id_detalle: id } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "El detalle de venta fue eliminado correctamente!" });
      } else {
        res.send({
          message: `No se pudo eliminar el detalle de venta con id_detalle=${id}. El registro no fue encontrado!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "No se pudo eliminar el detalle de venta con id_detalle=" + id
      });
    });
};

// Delete all DetalleVenta from the database.
exports.deleteAll = (req, res) => {
  DetalleVenta.destroy({ where: {}, truncate: false })
    .then(nums => {
      res.send({ message: `${nums} detalles de venta fueron eliminados correctamente!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todos los detalles de venta."
      });
    });
};

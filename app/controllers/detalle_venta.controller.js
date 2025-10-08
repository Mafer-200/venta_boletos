
const db = require("../models");
const DetalleVenta = db.detalle_ventas; 
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  
  const required = ["id_venta", "id_localidad", "id_partido", "cantidad", "precio_unitario"];
  const missing = required.filter(k => req.body[k] === undefined || req.body[k] === null || req.body[k] === "");
  if (missing.length > 0) {
    res.status(400).send({
      message: `Los siguientes campos son obligatorios y no pueden estar vacíos: ${missing.join(", ")}`
    });
    return;
  }

  
  const payload = {
    id_venta: req.body.id_venta,
    id_localidad: req.body.id_localidad,
    id_partido: req.body.id_partido,
    cantidad: req.body.cantidad,
    precio_unitario: req.body.precio_unitario
  };

  
  DetalleVenta.create(payload)
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear el detalle de la venta."
      });
    });
};
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


exports.findOne = (req, res) => {
  const id = req.params.id; 

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


exports.delete = (req, res) => {
  const id = req.params.id; // id_detalle

  
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

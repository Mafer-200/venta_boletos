
const db = require("../models");
const Venta = db.ventas; 
const Op = db.Sequelize.Op;


exports.create = (req, res) => {
  
  if (req.body.id_vendedor == null) {
    res.status(400).send({
      message: "El id_vendedor es obligatorio (no puede estar vacío)!"
    });
    return;
  }
  if (req.body.total_venta == null) {
    res.status(400).send({
      message: "El total_venta es obligatorio (no puede estar vacío)!"
    });
    return;
  }

  
  const payload = {
    id_vendedor: req.body.id_vendedor,
    fecha_venta: req.body.fecha_venta,   
    total_venta: req.body.total_venta
  };

  
  Venta.create(payload)
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear la Venta."
      });
    });
};


exports.findAll = (req, res) => {
  const id_vendedor = req.query.id_vendedor;
  const condition = id_vendedor ? { id_vendedor: { [Op.eq]: id_vendedor } } : null;

  Venta.findAll({ where: condition })
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar las ventas."
      });
    });
};


exports.findOne = (req, res) => {
  const id = req.params.id;

  Venta.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No se encontró la venta con id_venta=${id}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error recuperando venta con id_venta=" + id
      });
    });
};


exports.update = (req, res) => {
  const id = req.params.id;

  Venta.update(req.body, { where: { id_venta: id } })
    .then(num => {
      
      const updated = Array.isArray(num) ? num[0] : num;
      if (updated == 1) {
        res.send({ message: "La venta se actualizó correctamente." });
      } else {
        res.send({
          message: `No se pudo actualizar la venta con id_venta=${id}. Puede que no exista o req.body esté vacío.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error actualizando la venta con id_venta=" + id
      });
    });
};


exports.delete = (req, res) => {
  const id = req.params.id;

  
  Venta.destroy({ where: { id_venta: id } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "La venta fue eliminada correctamente!" });
      } else {
        res.send({
          message: `No se pudo eliminar la venta con id_venta=${id}. La venta no fue encontrada!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "No se pudo eliminar la venta con id_venta=" + id
      });
    });
};


exports.deleteAll = (req, res) => {
  Venta.destroy({ where: {}, truncate: false })
    .then(nums => {
      res.send({ message: `${nums} ventas fueron eliminadas correctamente!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todas las ventas."
      });
    });
};

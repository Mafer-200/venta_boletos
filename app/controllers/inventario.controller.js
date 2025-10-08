
const db = require("../models");
const Inventario = db.inventario_boletos; 
const Op = db.Sequelize.Op;


exports.create = (req, res) => {
  
  if (!req.body.id_partido || !req.body.id_localidad || !req.body.cantidad_total) {
    res.status(400).send({
      message: "Los campos id_partido, id_localidad y cantidad_total son obligatorios!"
    });
    return;
  }

  
  const disponible = req.body.cantidad_disponible != null 
    ? req.body.cantidad_disponible 
    : req.body.cantidad_total;

  
  const payload = {
    id_partido: req.body.id_partido,
    id_localidad: req.body.id_localidad,
    cantidad_total: req.body.cantidad_total,
    cantidad_disponible: disponible
  };

  
  Inventario.create(payload)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear el inventario de boletos."
      });
    });
};


exports.findAll = (req, res) => {
  const id_partido = req.query.id_partido;
  const id_localidad = req.query.id_localidad;

  let condition = {};

  if (id_partido) {
    condition.id_partido = id_partido;
  }

  if (id_localidad) {
    condition.id_localidad = id_localidad;
  }

  Inventario.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los inventarios de boletos."
      });
    });
};


exports.findOne = (req, res) => {
  const id = req.params.id;

  Inventario.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No se encontró el inventario con id=${id}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error recuperando inventario con id=" + id
      });
    });
};


exports.update = (req, res) => {
  const id = req.params.id;

  Inventario.update(req.body, { where: { id_inventario: id } })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "El inventario se actualizó correctamente."
        });
      } else {
        res.send({
          message: `No se pudo actualizar el inventario con id=${id}. Puede que no exista o req.body esté vacío.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error actualizando el inventario con id=" + id
      });
    });
};


exports.delete = (req, res) => {
  const id = req.params.id;

  
  Inventario.destroy({ where: { id_inventario: id } })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "El inventario fue eliminado correctamente!"
        });
      } else {
        res.send({
          message: `No se pudo eliminar el inventario con id=${id}. El registro no fue encontrado!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "No se pudo eliminar el inventario con id=" + id
      });
    });
};


exports.deleteAll = (req, res) => {
  Inventario.destroy({ where: {}, truncate: false })
    .then(nums => {
      res.send({
        message: `${nums} registros de inventario fueron eliminados correctamente!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todos los inventarios."
      });
    });
};

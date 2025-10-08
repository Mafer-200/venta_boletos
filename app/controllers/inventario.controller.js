
const db = require("../models");
const Inventario = db.inventario_boletos; 
const Op = db.Sequelize.Op;

// Create and Save a new Inventario
exports.create = (req, res) => {
  // Validamos que dentro del request no venga vacío alguno de los campos obligatorios
  if (!req.body.id_partido || !req.body.id_localidad || !req.body.cantidad_total) {
    res.status(400).send({
      message: "Los campos id_partido, id_localidad y cantidad_total son obligatorios!"
    });
    return;
  }

  // Si no mandan cantidad_disponible, por defecto será igual a cantidad_total
  const disponible = req.body.cantidad_disponible != null 
    ? req.body.cantidad_disponible 
    : req.body.cantidad_total;

  // Create un nuevo Inventario, definiendo una variable con la estructura del request
  const payload = {
    id_partido: req.body.id_partido,
    id_localidad: req.body.id_localidad,
    cantidad_total: req.body.cantidad_total,
    cantidad_disponible: disponible
  };

  // Save a new Inventario into the database
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

// Retrieve all Inventarios from the database. (filtro opcional por id_partido o id_localidad)
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

// Find a single Inventario by id
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

// Update an Inventario by the id in the request
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

// Delete an Inventario with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  // utilizamos el método destroy para eliminar el objeto; mandamos la condicionante where id = parámetro que recibimos
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

// Delete all Inventarios from the database.
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

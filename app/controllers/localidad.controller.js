// controllers/localidad.controller.js

// importamos db y los modelos; si tenemos uno o más, se puede referenciar db."nombreModelo".
const db = require("../models");
const Localidad = db.localidades;
const Op = db.Sequelize.Op;

// Create and Save a new Localidad
exports.create = (req, res) => {
  // Validamos que dentro del request no vengan vacíos los campos requeridos
  if (!req.body.nombre) {
    res.status(400).send({
      message: "El nombre es obligatorio (nombre no puede estar vacío)!"
    });
    return;
  }
  if (req.body.precio === undefined || req.body.precio === null) {
    res.status(400).send({
      message: "El precio es obligatorio (precio no puede estar vacío)!"
    });
    return;
  }

  // Create a Localidad, definiendo una variable con la estructura del request
  const payload = {
    nombre: req.body.nombre,
    precio: req.body.precio // DECIMAL(10,2)
  };

  // Save a new Localidad into the database
  Localidad.create(payload)
    .then(data => res.send(data))
    .catch(err => {
      // si hay violación de UNIQUE en 'nombre' o cualquier otro error
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear la Localidad."
      });
    });
};

// Retrieve all Localidades from the database. (filtro opcional por nombre)
exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  const condition = nombre ? { nombre: { [Op.iLike]: `%${nombre}%` } } : null;

  Localidad.findAll({ where: condition })
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar las localidades."
      });
    });
};

// Find a single Localidad by id_localidad
exports.findOne = (req, res) => {
  const id = req.params.id; // esperamos id_localidad en la URL

  Localidad.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No se encontró la localidad con id_localidad=${id}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error recuperando localidad con id_localidad=" + id
      });
    });
};

// Update a Localidad by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Localidad.update(req.body, { where: { id_localidad: id } })
    .then(([num]) => {
      if (num === 1) {
        res.send({ message: "La localidad se actualizó correctamente." });
      } else {
        res.send({
          message: `No se pudo actualizar la localidad con id_localidad=${id}. Puede que no exista o req.body esté vacío.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error actualizando la localidad con id_localidad=" + id
      });
    });
};

// Delete a Localidad with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  // utilizamos el método destroy para eliminar el objeto; mandamos la condicionante where id_localidad = parámetro que recibimos
  Localidad.destroy({ where: { id_localidad: id } })
    .then(num => {
      if (num === 1) {
        res.send({ message: "La localidad fue eliminada correctamente!" });
      } else {
        res.send({
          message: `No se pudo eliminar la localidad con id_localidad=${id}. La localidad no fue encontrada!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "No se pudo eliminar la localidad con id_localidad=" + id
      });
    });
};

// Delete all Localidades from the database.
exports.deleteAll = (req, res) => {
  Localidad.destroy({ where: {}, truncate: false })
    .then(nums => {
      res.send({ message: `${nums} localidades fueron eliminadas correctamente!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todas las localidades."
      });
    });
};

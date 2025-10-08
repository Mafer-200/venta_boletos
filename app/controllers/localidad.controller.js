const db = require("../models");
const Localidad = db.localidades;
const Op = db.Sequelize.Op;


exports.create = (req, res) => {
  
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

  
  const payload = {
    nombre: req.body.nombre,
    precio: req.body.precio // DECIMAL(10,2)
  };

  
  Localidad.create(payload)
    .then(data => res.send(data))
    .catch(err => {
      
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear la Localidad."
      });
    });
};


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


exports.findOne = (req, res) => {
  const id = req.params.id; 

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


exports.delete = (req, res) => {
  const id = req.params.id;

  
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

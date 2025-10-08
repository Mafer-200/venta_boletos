const db = require("../models");
const Partido = db.partidos; 
const Op = db.Sequelize.Op;


exports.create = (req, res) => {
  
  if (!req.body.equipo_local) {
    res.status(400).send({
      message: "El nombre del equipo local es obligatorio (equipo_local no puede estar vacío)!"
    });
    return;
  }

  
  const payload = {
    equipo_visitante: req.body.equipo_visitante,
    equipo_local: req.body.equipo_local,
    fecha_partido: req.body.fecha_partido,
    estadio: req.body.estadio,
    estado: req.body.estado           // "programado" | "activo" | "finalizado"
  };

  
  Partido.create(payload)
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al crear el Partido."
      });
    });
};


exports.findAll = (req, res) => {
  const equipo_local = req.query.equipo_local;
  const condition = equipo_local ? { equipo_local: { [Op.iLike]: `%${equipo_local}%` } } : null;

  Partido.findAll({ where: condition })
    .then(data => res.send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al recuperar los partidos."
      });
    });
};


exports.findOne = (req, res) => {
  const id = req.params.id;

  Partido.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `No se encontró el partido con id_partido=${id}`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error recuperando partido con id_partido=" + id
      });
    });
};


exports.update = (req, res) => {
  const id = req.params.id;

  Partido.update(req.body, { where: { id_partido: id } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "El partido se actualizó correctamente." });
      } else {
        res.send({
          message: `No se pudo actualizar el partido con id_partido=${id}. Puede que no exista o req.body esté vacío.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error actualizando el partido con id_partido=" + id
      });
    });
};


exports.delete = (req, res) => {
  const id = req.params.id;

  
  Partido.destroy({ where: { id_partido: id } })
    .then(num => {
      if (num == 1) {
        res.send({ message: "El partido fue eliminado correctamente!" });
      } else {
        res.send({
          message: `No se pudo eliminar el partido con id_partido=${id}. El partido no fue encontrado!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "No se pudo eliminar el partido con id_partido=" + id
      });
    });
};


exports.deleteAll = (req, res) => {
  Partido.destroy({ where: {}, truncate: false })
    .then(nums => {
      res.send({ message: `${nums} partidos fueron eliminados correctamente!` });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Ocurrió un error al eliminar todos los partidos."
      });
    });
};

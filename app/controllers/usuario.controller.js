// controllers/usuario.controller.js
const db = require("../models");
const Usuario = db.usuarios; 
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");

const ROLES_PERMITIDOS = ["administrador", "vendedor"];
const SALT_ROUNDS = 10;

// helper: limpia el objeto para no exponer contrasena_hash
function sanitize(userInstance) {
  if (!userInstance) return userInstance;
  const json = userInstance.toJSON ? userInstance.toJSON() : userInstance;
  const { contrasena_hash, ...safe } = json;
  return safe;
}

// Create and Save a new Usuario
exports.create = async (req, res) => {
  try {
    const { nombre_usuario, contrasena, nombre_completo, rol } = req.body;

    // Validaciones mínimas
    if (!nombre_usuario || !contrasena || !nombre_completo || !rol) {
      return res.status(400).send({ message: "Faltan campos requeridos." });
    }
    if (!ROLES_PERMITIDOS.includes(rol)) {
      return res.status(400).send({ message: "Rol inválido." });
    }

    // Hash de contraseña
    const contrasena_hash = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const nuevo = await Usuario.create({
      nombre_usuario,
      contrasena_hash,
      nombre_completo,
      rol,
      // fecha_creacion lo pone la DB con DEFAULT NOW()
    });

    return res.status(201).send(sanitize(nuevo));
  } catch (err) {
    // manejo de UNIQUE en nombre_usuario (Postgres/Sequelize)
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).send({ message: "El nombre de usuario ya existe." });
    }
    return res
      .status(500)
      .send({ message: err.message || "Error creando el usuario." });
  }
};

// Retrieve all Usuarios (opcional: filtrar por nombre_usuario con ?q= )
exports.findAll = async (req, res) => {
  try {
    const q = req.query.q;
    const where = q ? { nombre_usuario: { [Op.iLike]: `%${q}%` } } : undefined;

    const usuarios = await Usuario.findAll({ where, order: [["id_usuario", "ASC"]] });
    return res.send(usuarios.map(sanitize));
  } catch (err) {
    return res
      .status(500)
      .send({ message: err.message || "Error obteniendo usuarios." });
  }
};

// Find one by ID
exports.findOne = async (req, res) => {
  try {
    const id = req.params.id;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).send({ message: `No se encontró usuario id=${id}` });
    }
    return res.send(sanitize(usuario));
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error recuperando usuario id=" + req.params.id });
  }
};

// (Opcional) Find one by nombre_usuario
exports.findByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const usuario = await Usuario.findOne({ where: { nombre_usuario: username } });
    if (!usuario) {
      return res
        .status(404)
        .send({ message: `No se encontró usuario nombre_usuario=${username}` });
    }
    return res.send(sanitize(usuario));
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error recuperando usuario nombre_usuario=" + req.params.username });
  }
};

// Update by ID (si viene 'contrasena', se vuelve a hashear)
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = { ...req.body };

    if (payload.rol && !ROLES_PERMITIDOS.includes(payload.rol)) {
      return res.status(400).send({ message: "Rol inválido." });
    }

    if (payload.contrasena) {
      payload.contrasena_hash = await bcrypt.hash(payload.contrasena, SALT_ROUNDS);
      delete payload.contrasena;
    }

    const [num] = await Usuario.update(payload, { where: { id_usuario: id } });
    if (num !== 1) {
      return res.status(404).send({
        message: `No se pudo actualizar usuario id=${id}. ¿Existe o body vacío?`,
      });
    }
    const actualizado = await Usuario.findByPk(id);
    return res.send({ message: "Usuario actualizado correctamente.", data: sanitize(actualizado) });
  } catch (err) {
    // posible conflicto por UNIQUE en nombre_usuario
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).send({ message: "El nombre de usuario ya existe." });
    }
    return res
      .status(500)
      .send({ message: "Error actualizando usuario id=" + req.params.id });
  }
};

// Delete by ID
exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const num = await Usuario.destroy({ where: { id_usuario: id } });
    if (num !== 1) {
      return res
        .status(404)
        .send({ message: `No se pudo eliminar usuario id=${id}.` });
    }
    return res.send({ message: "Usuario eliminado correctamente." });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error eliminando usuario id=" + req.params.id });
  }
};

// Delete all (¡cuidado!)
exports.deleteAll = async (_req, res) => {
  try {
    const nums = await Usuario.destroy({ where: {}, truncate: false });
    return res.send({ message: `${nums} usuarios eliminados.` });
  } catch (err) {
    return res
      .status(500)
      .send({ message: err.message || "Error eliminando todos los usuarios." });
  }
};

// Listar por rol (similar a findAllStatus del ejemplo)
exports.findAllByRol = async (req, res) => {
  try {
    const rol = req.params.rol;
    if (!ROLES_PERMITIDOS.includes(rol)) {
      return res.status(400).send({ message: "Rol inválido." });
    }
    const usuarios = await Usuario.findAll({ where: { rol } });
    return res.send(usuarios.map(sanitize));
  } catch (err) {
    return res
      .status(500)
      .send({ message: err.message || "Error obteniendo usuarios por rol." });
  }
};

// (Opcional) Autenticación básica: verifica usuario + contraseña
exports.login = async (req, res) => {
  try {
    const { nombre_usuario, contrasena } = req.body;
    if (!nombre_usuario || !contrasena) {
      return res.status(400).send({ message: "Credenciales incompletas." });
    }
    const usuario = await Usuario.findOne({ where: { nombre_usuario } });
    if (!usuario) return res.status(401).send({ message: "Credenciales inválidas." });

    const ok = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!ok) return res.status(401).send({ message: "Credenciales inválidas." });

    // aquí podrías firmar un JWT si lo usas; por ahora devolvemos datos no sensibles
    return res.send({ message: "Login exitoso.", usuario: sanitize(usuario) });
  } catch (err) {
    return res.status(500).send({ message: "Error en login." });
  }
};

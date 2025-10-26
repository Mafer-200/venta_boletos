
const db = require("../models");
const Usuario = db.usuarios; 
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");

const ROLES_PERMITIDOS = ["administrador", "vendedor"];
const SALT_ROUNDS = 10;


function sanitize(userInstance) {
  if (!userInstance) return userInstance;
  const json = userInstance.toJSON ? userInstance.toJSON() : userInstance;
  const { contrasena_hash, ...safe } = json;
  return safe;
}


exports.create = async (req, res) => {
  try {
    const { nombre_usuario, contrasena, nombre_completo, rol } = req.body;

    
    if (!nombre_usuario || !contrasena || !nombre_completo || !rol) {
      return res.status(400).send({ message: "Faltan campos requeridos." });
    }
    if (!ROLES_PERMITIDOS.includes(rol)) {
      return res.status(400).send({ message: "Rol inválido." });
    }

    
    const contrasena_hash = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const nuevo = await Usuario.create({
      nombre_usuario,
      contrasena_hash,
      nombre_completo,
      rol,
      
    });

    return res.status(201).send(sanitize(nuevo));
  } catch (err) {
    
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).send({ message: "El nombre de usuario ya existe." });
    }
    return res
      .status(500)
      .send({ message: err.message || "Error creando el usuario." });
  }
};


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


exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = { ...req.body };

    // ✅ Normalizar el rol y validar
    if (payload.rol) payload.rol = String(payload.rol).toLowerCase();
    if (payload.rol && !ROLES_PERMITIDOS.includes(payload.rol)) {
      return res.status(400).send({ message: "Rol inválido." });
    }

    // ✅ Si viene contraseña, generar hash
    if (payload.contrasena) {
      payload.contrasena_hash = await bcrypt.hash(payload.contrasena, SALT_ROUNDS);
      delete payload.contrasena;
    }

    // ✅ Evitar que intenten cambiar el id
    delete payload.id_usuario;

    const [num] = await Usuario.update(payload, { where: { id_usuario: id } });
    if (num !== 1) {
      return res.status(404).send({
        message: `No se pudo actualizar usuario id=${id}. ¿Existe o body vacío?`,
      });
    }

    const actualizado = await Usuario.findByPk(id);
    return res.send({ message: "Usuario actualizado correctamente.", data: sanitize(actualizado) });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).send({ message: "El nombre de usuario ya existe." });
    }
    return res
      .status(500)
      .send({ message: "Error actualizando usuario id=" + req.params.id });
  }
};



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

    
    return res.send({ message: "Login exitoso.", usuario: sanitize(usuario) });
  } catch (err) {
    return res.status(500).send({ message: "Error en login." });
  }
};

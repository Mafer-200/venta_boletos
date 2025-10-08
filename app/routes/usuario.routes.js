module.exports = app => {
  const usuario = require("../controllers/usuario.controller.js");

  var router = require("express").Router();

  // Crear un nuevo Usuario
  router.post("/create", usuario.create);

  // Listar todos los Usuarios
  router.get("/", usuario.findAll);

  // Obtener un solo Usuario por id
  router.get("/:id", usuario.findOne);

  // Actualizar un Usuario por id
  router.put("/update/:id", usuario.update);

  // Eliminar un Usuario por id
  router.delete("/delete/:id", usuario.delete);

  // Eliminar todos los Usuarios
  router.delete("/delete/", usuario.deleteAll);

  // Listar todos los usuarios por rol (administrador o vendedor)
  router.get("/rol/:rol", usuario.findAllByRol);

  // Iniciar sesión (login)
  router.post("/login", usuario.login);


  app.use("/api/usuarios", router);
};

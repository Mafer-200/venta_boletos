// Importamos módulos
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync(); 
// Si quieres reiniciar tablas:
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// Ruta simple
app.get("/", (req, res) => {
  res.json({ message: "API de Usuarios - UMG Web Application" });
});

// Rutas de Usuarios
require("./app/routes/usuario.routes")(app);
require("./app/routes/partido.routes")(app);
require("./app/routes/localidad.routes")(app);
require("./app/routes/inventario.routes")(app);
require("./app/routes/venta.routes")(app);
require("./app/routes/detalle_venta.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}.`);
});

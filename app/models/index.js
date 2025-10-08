const dbConfig = require("../config/db.config.js");
// cargamos el módulo sequelize "ORM" para el manejo de las entidades como objetos. 
const Sequelize = require("sequelize");

// Inicializamos Sequelize con la configuración de conexión
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  }
});

// Creamos el objeto db para almacenar las entidades (modelos)
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importamos y registramos el modelo de Usuarios
db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);
db.partidos = require("./partido.model.js")(sequelize, Sequelize);
db.localidades = require("./localidad.model.js")(sequelize, Sequelize);
db.inventario_boletos = require("./inventario_boletos.model.js")(sequelize, Sequelize);
db.ventas= require("./venta.model.js")(sequelize, Sequelize);
db.detalle_ventas= require("./detalle_venta.model.js")(sequelize, Sequelize);

// Exportamos el objeto db con Sequelize y todos los modelos definidos
db.partidos.hasMany(db.inventario_boletos, { foreignKey: "id_partido" });
db.localidades.hasMany(db.inventario_boletos, { foreignKey: "id_localidad" });

db.inventario_boletos.belongsTo(db.partidos, { foreignKey: "id_partido" });
db.inventario_boletos.belongsTo(db.localidades, { foreignKey: "id_localidad" });

db.ventas.belongsTo(db.usuarios, { foreignKey: "id_vendedor", as: "vendedor" });
db.usuarios.hasMany(db.ventas, { foreignKey: "id_vendedor", as: "ventas" });

db.detalle_ventas.belongsTo(db.ventas,      { foreignKey: "id_venta" });
db.ventas.hasMany(db.detalle_ventas,        { foreignKey: "id_venta" });

db.detalle_ventas.belongsTo(db.localidades, { foreignKey: "id_localidad" });
db.localidades.hasMany(db.detalle_ventas,   { foreignKey: "id_localidad" });

db.detalle_ventas.belongsTo(db.partidos,    { foreignKey: "id_partido" });
db.partidos.hasMany(db.detalle_ventas,      { foreignKey: "id_partido" });


module.exports = db;

// models/inventario_boletos.model.js
module.exports = (sequelize, Sequelize) => {
  const Inventario = sequelize.define("inventario_boletos", {
    id_inventario: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_partido: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "partidos",   // nombre de la tabla referenciada
        key: "id_partido"
      }
    },
    id_localidad: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "localidades", // nombre de la tabla referenciada
        key: "id_localidad"
      }
    },
    cantidad_total: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    cantidad_disponible: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  });

  return Inventario;
};

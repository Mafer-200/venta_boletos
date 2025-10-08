

// models/partido.model.js
module.exports = (sequelize, Sequelize) => {
  const Partido = sequelize.define("partido", {
    id_partido: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    equipo_visitante: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    equipo_local: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    fecha_partido: {
      type: Sequelize.DATE,
      allowNull: false
    },
    estadio: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    estado: {
      type: Sequelize.ENUM("programado", "activo", "finalizado"),
      allowNull: false,
      defaultValue: "programado"
    }
  },
{
    tableName: "partidos",     
    freezeTableName: true,     
    timestamps: true
  });

  return Partido;
};

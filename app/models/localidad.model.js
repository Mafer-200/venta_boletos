

// models/localidad.model.js
module.exports = (sequelize, Sequelize) => {
  const Localidad = sequelize.define("localidad", {
    id_localidad: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    precio: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    }
  },
  {
      tableName: "localidades",   
      freezeTableName: true,      
      timestamps: true            
    }
);

  return Localidad;
};

// models/venta.model.js
module.exports = (sequelize, Sequelize) => {
  const Venta = sequelize.define("venta",{
      id_venta: {
        type: Sequelize.INTEGER,
        autoIncrement: true,      
        primaryKey: true
      },
      id_vendedor: {
        type: Sequelize.INTEGER,
        allowNull: false,         
        references: {

          model: "usuarios",      
          key: "id_usuario"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      fecha_venta: {
        type: Sequelize.DATE,     
        defaultValue: Sequelize.NOW 
      },
      total_venta: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false          // NOT NULL
      }
    },
    {
      tableName: "ventas",        
      timestamps: false,         
      indexes: [
        { fields: ["id_vendedor"] } 
      ]
    }
  );

  return Venta;
};

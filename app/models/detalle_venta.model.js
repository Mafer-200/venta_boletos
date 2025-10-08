// models/detalle_venta.model.js
module.exports = (sequelize, Sequelize) => {
  const DetalleVenta = sequelize.define(
    "detalle_venta",
    {
      id_detalle: {
        type: Sequelize.INTEGER,
        autoIncrement: true,   // SERIAL
        primaryKey: true
      },
      id_venta: {
        type: Sequelize.INTEGER,
        allowNull: false,      // NOT NULL
        references: {
          model: "ventas",     // FK a ventas(id_venta)
          key: "id_venta"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      id_localidad: {
        type: Sequelize.INTEGER,
        allowNull: false,      // NOT NULL
        references: {
          model: "localidades", // FK a localidades(id_localidad)
          key: "id_localidad"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      id_partido: {
        type: Sequelize.INTEGER,
        allowNull: false,      // NOT NULL
        references: {
          model: "partidos",   // FK a partidos(id_partido)
          key: "id_partido"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,      // NOT NULL
        validate: {
          min: 1               // al menos 1 boleto
        }
      },
      precio_unitario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,      // NOT NULL
        validate: {
          min: 0
        }
      }
    },
    {
      tableName: "detalle_ventas", 
      timestamps: false,           
      indexes: [
        { fields: ["id_venta"] },
        { fields: ["id_localidad"] },
        { fields: ["id_partido"] }
      ]
    }
  );

  return DetalleVenta;
};

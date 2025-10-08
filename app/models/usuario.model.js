// Utilizamos module.exports para exportar objetos para que puedan ser utilizados en otras clases
module.exports = (sequelize, Sequelize) => {
    // usamos el sequelize.define para "definir" el nombre de la entidad en la BD, en este caso "usuario"
    // Usamos type.Sequelize para definir el tipo de datos de cada atributo de la entidad 
    const usuario = sequelize.define("usuario", {
        id_usuario: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nombre_usuario: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true
        },
        contrasena_hash: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        nombre_completo: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        rol: {
            type: Sequelize.STRING(20),
            allowNull: false,
            validate: {
                isIn: [['administrador', 'vendedor']]
            }
        },
        fecha_creacion: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    return usuario;
};

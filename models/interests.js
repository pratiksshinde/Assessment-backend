const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Interest = sequelize.define('Interest', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' }
    },
    dealId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Deals', key: 'id' }
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: true
});

Interest.associate = (models) => {
    // Interest belongs to the investor who expressed it
    Interest.belongsTo(models.User, { foreignKey: 'userId', as: 'investor' });

    // Interest belongs to the deal it was expressed for
    Interest.belongsTo(models.Deal, { foreignKey: 'dealId', as: 'deal' });
};

module.exports = Interest;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Investment = sequelize.define('Investment', {
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
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true
});

Investment.associate = (models) => {
    // Investment belongs to the investor who made it
    Investment.belongsTo(models.User, { foreignKey: 'userId', as: 'investor' });

    // Investment belongs to the deal it was made in
    Investment.belongsTo(models.Deal, { foreignKey: 'dealId', as: 'deal' });
};

module.exports = Investment;
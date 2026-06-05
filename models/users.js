const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'investor', 'corporate'),
        defaultValue: 'investor'
    }
}, {
    timestamps: true
});

User.associate = (models) => {
    User.hasMany(models.Deal, { foreignKey: 'userId', as: 'deals' });
    User.hasMany(models.Interest, { foreignKey: 'userId', as: 'interests' });
    User.hasMany(models.Investment, { foreignKey: 'userId', as: 'investments' });
    User.hasOne(models.InvestorPreference, { foreignKey: 'userId', as: 'preferences' });
};

module.exports = User;
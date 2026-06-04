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
    // A corporate user can post many deals
    User.hasMany(models.Deal, { foreignKey: 'userId', as: 'deals' });

    // An investor can express interest in many deals
    User.hasMany(models.Interest, { foreignKey: 'userId', as: 'interests' });

    // An investor can make many investments
    User.hasMany(models.Investment, { foreignKey: 'userId', as: 'investments' });

    // An investor has one preference profile
    User.hasOne(models.InvestorPreference, { foreignKey: 'userId', as: 'preferences' });
};

module.exports = User;
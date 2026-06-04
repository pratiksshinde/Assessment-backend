const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Deal = sequelize.define('Deal', {
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
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    industry: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ROI: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    riskLevel: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false
    },
    minInvestment: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    maxInvestment: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    targetAmount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    currentRaisedAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    closingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('open', 'partially_filled', 'closed'),
        defaultValue: 'open'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: []
    },
    riskScore: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

Deal.associate = (models) => {
    // Deal belongs to the corporate user who created it
    Deal.belongsTo(models.User, { foreignKey: 'userId', as: 'postedBy' });

    // A deal can receive many interest expressions
    Deal.hasMany(models.Interest, { foreignKey: 'dealId', as: 'interests' });

    // A deal can receive many investments
    Deal.hasMany(models.Investment, { foreignKey: 'dealId', as: 'investments' });
};

module.exports = Deal;
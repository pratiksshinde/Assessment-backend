const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InvestorPreference = sequelize.define('InvestorPreference', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // one profile per investor
        references: { model: 'Users', key: 'id' }
    },
    riskAppetite: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false
    },
    preferredIndustries: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: []
    },
    budgetMin: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    budgetMax: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    timestamps: true
});

InvestorPreference.associate = (models) => {
    // Preference profile belongs to one investor
    InvestorPreference.belongsTo(models.User, { foreignKey: 'userId', as: 'investor' });
};

module.exports = InvestorPreference;
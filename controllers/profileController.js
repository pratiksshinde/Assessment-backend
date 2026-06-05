
const { InvestorPreference } = require('../models');

const setupInvestorPreferences = async (req, res) => {
    try {
        const existing = await InvestorPreference.findOne({ where: { userId: req.user.id } });
        const { riskAppetite, preferredIndustries, budgetMin, budgetMax } = req.body;
        if (!existing) {
            await InvestorPreference.create({
                userId: req.user.id,
                riskAppetite: riskAppetite || 'medium',
                preferredIndustries: preferredIndustries || [],
                budgetMin: budgetMin || null,
                budgetMax: budgetMax || null
            });
        }
    } catch (error) {
        console.error('Error setting up investor preferences:', error);
    }
};

const getPreferences = async (req, res) => {
    try {
        const preferences = await InvestorPreference.findOne({ where: { userId: req.user.id } });
        if (!preferences) {
            return res.status(404).json({ message: 'Preferences not found' });
        }
        res.json(preferences);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const updatePreferences = async (req, res) => {
    const { riskAppetite, preferredIndustries, budgetMin, budgetMax } = req.body;
    try {
        let preferences = await InvestorPreference.findOne({ where: { userId: req.user.id } });
        if (!preferences) {
            preferences = await InvestorPreference.create({
                userId: req.user.id,
                riskAppetite,
                preferredIndustries,
                budgetMin,
                budgetMax
            });
            return res.status(201).json({ message: 'Preferences created successfully', preferences });
        }

        preferences.riskAppetite = riskAppetite || preferences.riskAppetite;
        preferences.preferredIndustries = preferredIndustries || preferences.preferredIndustries;
        preferences.budgetMin = budgetMin || preferences.budgetMin;
        preferences.budgetMax = budgetMax || preferences.budgetMax;

        await preferences.save();
        res.json({ message: 'Preferences updated successfully', preferences });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { getPreferences, updatePreferences, setupInvestorPreferences }; 
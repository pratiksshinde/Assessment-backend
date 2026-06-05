const { Deal, InvestorPreference } = require('../models');
const { Op } = require('sequelize');
const redis = require('../config/redis');

const CACHE_TTL = 60 * 10; 

const getRecommendedDeals = async (userId) => {
  const cacheKey = `recommended:${userId}`;

  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log('Cache hit for user', userId);
    return JSON.parse(cached);
  }

  const prefs = await InvestorPreference.findOne({ where: { userId } });
  if (!prefs) throw new Error('Investor profile not set up');

  const deals = await Deal.findAll({
    where: { isDeleted: false, status: { [Op.ne]: 'closed' } }
  });

  const maxROI = Math.max(...deals.map(x => x.ROI)); 

  const scored = deals.map(deal => {
    const d = deal.toJSON();

    const riskMap = { low: 0, medium: 1, high: 2 };
    const riskDiff = Math.abs(riskMap[d.riskLevel] - riskMap[prefs.riskAppetite]);
    const riskScore = riskDiff === 0 ? 1 : riskDiff === 1 ? 0.5 : 0;

    const industryScore = prefs.preferredIndustries.includes(d.industry) ? 1 : 0;
    const budgetScore = (d.minInvestment <= prefs.budgetMax && d.maxInvestment >= prefs.budgetMin) ? 1 : 0;
    const roiScore = maxROI > 0 ? d.ROI / maxROI : 0;
    const popularityScore = d.targetAmount > 0 ? Math.min(d.currentRaisedAmount / d.targetAmount, 1) : 0;

    const totalScore =
      riskScore * 0.30 +
      industryScore * 0.25 +
      budgetScore * 0.20 +
      roiScore * 0.15 +
      popularityScore * 0.10;

    return { ...d, matchScore: parseFloat(totalScore.toFixed(3)) };
  });

  const result = scored.sort((a, b) => b.matchScore - a.matchScore);

  await redis.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL);

  return result;
};

module.exports = { getRecommendedDeals };
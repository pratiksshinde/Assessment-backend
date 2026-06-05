const { Deal, Investment, Interest } = require('../models'); 
const { getRecommendedDeals } = require('../services/matchingService');
const { Op } = require('sequelize'); 

const createDeal = async (req, res) => {
  const userId = req.user.id;
  const { companyName, industry, ROI, riskLevel, minInvestment, maxInvestment,
          targetAmount, closingDate, description, tags, riskScore } = req.body;



  if (!companyName || !ROI || !riskLevel || !description || !riskScore ||
      !industry || !minInvestment || !maxInvestment || !targetAmount || !closingDate) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const deal = await Deal.create({
      companyName, industry, ROI, riskLevel, minInvestment, maxInvestment,
      targetAmount, closingDate, description, tags, riskScore, userId

    });
    res.status(201).json({ message: 'Deal created successfully', deal });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const UpdateDeal = async (req, res) => {
  const { id } = req.params;
  const { companyName, industry, ROI, riskLevel, minInvestment, maxInvestment,
          targetAmount, closingDate, status, description, tags, riskScore } = req.body;

  try {
    const deal = await Deal.findByPk(id);
    
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    if (deal.isDeleted) return res.status(404).json({ message: 'Deal not found' });
    
    if (deal.userId !== req.user.id) {
     return res.status(403).json({ message: 'Not authorized' });
    }


    deal.companyName = companyName || deal.companyName;
    deal.industry = industry || deal.industry;
    deal.ROI = ROI || deal.ROI;
    deal.riskLevel = riskLevel || deal.riskLevel;
    deal.minInvestment = minInvestment || deal.minInvestment;
    deal.maxInvestment = maxInvestment || deal.maxInvestment;
    deal.targetAmount = targetAmount || deal.targetAmount;
    deal.closingDate = closingDate || deal.closingDate;
    deal.status = status || deal.status;
    deal.description = description || deal.description;
    deal.tags = tags || deal.tags;
    deal.riskScore = riskScore || deal.riskScore;

    await deal.save();
    res.json({ message: 'Deal updated successfully', deal });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const DeleteDeal = async (req, res) => {
  const { id } = req.params;
  try {
    const deal = await Deal.findByPk(id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    if (deal.userId !== req.user.id) {
     return res.status(403).json({ message: 'Not authorized' });
    }
    deal.isDeleted = true;
    await deal.save();
    res.json({ message: 'Deal soft deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const recommended = async (req, res) => {
  try {
    const deals = await getRecommendedDeals(req.user.id);
    res.json({ deals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const analytics = async (req, res) => {
  try { 
    const { id } = req.params;
    const deal = await Deal.findByPk(id); 
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    if (deal.userId !== req.user.id) {
     return res.status(403).json({ message: 'Not authorized' });
    }

    const totalInvestors  = await Investment.count({ where: { dealId: id } });
    const totalInterested = await Interest.count({ where: { dealId: id } });
    const conversionRate  = totalInterested > 0
      ? ((totalInvestors / totalInterested) * 100).toFixed(1) + '%'
      : '0%';

    res.json({
      totalRaised: deal.currentRaisedAmount,
      targetAmount: deal.targetAmount,
      totalInvestors,
      totalInterested,
      conversionRate
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getDeals = async (req, res) => {
  try {
    const { industry, minROI, maxROI, riskLevel, sortBy = 'createdAt', page = 1, limit = 10 } = req.query;

    const where = { isDeleted: false };
    if (industry)  where.industry  = industry;
    if (riskLevel) where.riskLevel = riskLevel;
    if (minROI || maxROI) {
      where.ROI = {};
      if (minROI) where.ROI[Op.gte] = parseFloat(minROI);
      if (maxROI) where.ROI[Op.lte] = parseFloat(maxROI);
    }

    const validSorts = ['ROI', 'closingDate', 'currentRaisedAmount', 'createdAt'];
    const order  = [[validSorts.includes(sortBy) ? sortBy : 'createdAt', 'DESC']];
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Deal.findAndCountAll({ where, order, limit: parseInt(limit), offset });
    res.json({ total: count, page: parseInt(page), deals: rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { createDeal, UpdateDeal, DeleteDeal, recommended, analytics, getDeals };

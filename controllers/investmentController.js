
const { Deal, Investment, sequelize } = require('../models');
const redis = require('../config/redis');

const invest = async (req, res) => {
  const { id: dealId } = req.params;
  const { amount } = req.body;
  const userId = req.user.id;

  const t = await sequelize.transaction();
  try {
    // Lock the row so no other request can read/write it at the same time
    const deal = await Deal.findOne({
      where: { id: dealId, isDeleted: false },
      lock: t.LOCK.UPDATE,   // ← this is the concurrency fix
      transaction: t
    });

    if (!deal) throw new Error('Deal not found');
    if (deal.status === 'closed') throw new Error('Deal is closed');

    // Validate amount within allowed range
    if (amount < deal.minInvestment || amount > deal.maxInvestment) {
      throw new Error(`Amount must be between ${deal.minInvestment} and ${deal.maxInvestment}`);
    }

    // Check it won't exceed target
    if (deal.currentRaisedAmount + amount > deal.targetAmount) {
      throw new Error('Investment would exceed target amount');
    }

    // Update raised amount
    deal.currentRaisedAmount += amount;

    // Auto-update status
    if (deal.currentRaisedAmount >= deal.targetAmount) {
      deal.status = 'closed';
    } else if (deal.currentRaisedAmount > 0) {
      deal.status = 'partially_filled';
    }

    await deal.save({ transaction: t });

    // Create investment record
    await Investment.create({ userId, dealId, amount, status: 'confirmed' }, { transaction: t });

    await t.commit();
    // Invalidate this investor's recommended deals cache
    await redis.del(`recommended:${userId}`);
    res.status(201).json({ message: 'Investment successful', currentRaisedAmount: deal.currentRaisedAmount });

  } catch (err) {
    await t.rollback();
    res.status(400).json({ message: err.message });
  }
};

module.exports = { invest };
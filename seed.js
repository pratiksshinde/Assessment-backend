
// This will clear existing data and insert fresh seed data

require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('./config/database');
require('./models/index');

const {
  User,
  Deal,
  Investment,
  Interest,
  InvestorPreference
} = require('./models');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    // Wipe in correct order (children before parents)
    await Investment.destroy({ where: {} });
    await Interest.destroy({ where: {} });
    await InvestorPreference.destroy({ where: {} });
    await Deal.destroy({ where: {} });
    await User.destroy({ where: {} });
    console.log('Old data cleared');

    // ─── USERS ───────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash('Password@123', 10);

    const [admin, corp1, corp2, inv1, inv2, inv3] = await User.bulkCreate([
      {
        name: 'Super Admin',
        email: 'admin@platform.com',
        password: hashedPassword,
        role: 'admin'
      },
      {
        name: 'TechCorp Ventures',
        email: 'techcorp@corporate.com',
        password: hashedPassword,
        role: 'corporate'
      },
      {
        name: 'GreenEnergy Ltd',
        email: 'greenenergy@corporate.com',
        password: hashedPassword,
        role: 'corporate'
      },
      {
        name: 'Rahul Mehta',
        email: 'rahul@investor.com',
        password: hashedPassword,
        role: 'investor'
      },
      {
        name: 'Priya Sharma',
        email: 'priya@investor.com',
        password: hashedPassword,
        role: 'investor'
      },
      {
        name: 'Arjun Kapoor',
        email: 'arjun@investor.com',
        password: hashedPassword,
        role: 'investor'
      }
    ]);
    console.log('Users created');

    // ─── INVESTOR PREFERENCES ────────────────────────────────
    await InvestorPreference.bulkCreate([
      {
        userId: inv1.id,
        riskAppetite: 'high',
        preferredIndustries: ['Technology', 'FinTech'],
        budgetMin: 5000,
        budgetMax: 100000
      },
      {
        userId: inv2.id,
        riskAppetite: 'low',
        preferredIndustries: ['Healthcare', 'Energy'],
        budgetMin: 1000,
        budgetMax: 30000
      },
      {
        userId: inv3.id,
        riskAppetite: 'medium',
        preferredIndustries: ['Technology', 'Real Estate', 'Energy'],
        budgetMin: 2000,
        budgetMax: 50000
      }
    ]);
    console.log('Investor preferences created');

    // ─── DEALS ───────────────────────────────────────────────
    const [deal1, deal2, deal3, deal4, deal5] = await Deal.bulkCreate([
      {
        userId: corp1.id,
        companyName: 'NovaPay',
        industry: 'FinTech',
        ROI: 18.5,
        riskLevel: 'high',
        minInvestment: 5000,
        maxInvestment: 100000,
        targetAmount: 1000000,
        currentRaisedAmount: 350000,
        closingDate: '2025-12-31',
        status: 'partially_filled',
        description: 'NovaPay is building the next-gen UPI infrastructure for Tier 2 and Tier 3 cities in India. Series A round.',
        tags: ['fintech', 'payments', 'series-a'],
        riskScore: 7.8,
        isDeleted: false
      },
      {
        userId: corp1.id,
        companyName: 'CloudMesh AI',
        industry: 'Technology',
        ROI: 22.0,
        riskLevel: 'high',
        minInvestment: 10000,
        maxInvestment: 200000,
        targetAmount: 2000000,
        currentRaisedAmount: 800000,
        closingDate: '2025-11-15',
        status: 'partially_filled',
        description: 'CloudMesh AI provides enterprise-grade LLM infrastructure with a focus on data privacy and on-premise deployment.',
        tags: ['ai', 'b2b', 'saas', 'series-b'],
        riskScore: 8.2,
        isDeleted: false
      },
      {
        userId: corp2.id,
        companyName: 'SolarGrid India',
        industry: 'Energy',
        ROI: 11.0,
        riskLevel: 'low',
        minInvestment: 1000,
        maxInvestment: 50000,
        targetAmount: 500000,
        currentRaisedAmount: 490000,
        closingDate: '2025-10-01',
        status: 'partially_filled',
        description: 'SolarGrid is deploying rooftop solar installations across 5 states with guaranteed government buyback contracts.',
        tags: ['renewable', 'esg', 'government-backed'],
        riskScore: 3.1,
        isDeleted: false
      },
      {
        userId: corp2.id,
        companyName: 'MedChain',
        industry: 'Healthcare',
        ROI: 14.0,
        riskLevel: 'medium',
        minInvestment: 2000,
        maxInvestment: 75000,
        targetAmount: 800000,
        currentRaisedAmount: 0,
        closingDate: '2026-03-31',
        status: 'open',
        description: 'MedChain is building a blockchain-based medical records system for hospital chains. Currently in pilot with 3 major hospitals.',
        tags: ['healthtech', 'blockchain', 'b2b'],
        riskScore: 5.5,
        isDeleted: false
      },
      {
        userId: corp1.id,
        companyName: 'UrbanNest',
        industry: 'Real Estate',
        ROI: 9.5,
        riskLevel: 'medium',
        minInvestment: 3000,
        maxInvestment: 60000,
        targetAmount: 600000,
        currentRaisedAmount: 600000,
        closingDate: '2025-08-01',
        status: 'closed',
        description: 'UrbanNest is a fractional real estate platform for residential properties in Pune and Bangalore. This round is now closed.',
        tags: ['proptech', 'fractional', 'residential'],
        riskScore: 4.8,
        isDeleted: false
      }
    ]);
    console.log('Deals created');

    // ─── INVESTMENTS ─────────────────────────────────────────
    await Investment.bulkCreate([
      { userId: inv1.id, dealId: deal1.id, amount: 50000, status: 'confirmed' },
      { userId: inv1.id, dealId: deal2.id, amount: 75000, status: 'confirmed' },
      { userId: inv2.id, dealId: deal3.id, amount: 15000, status: 'confirmed' },
      { userId: inv3.id, dealId: deal1.id, amount: 20000, status: 'confirmed' },
      { userId: inv3.id, dealId: deal4.id, amount: 10000, status: 'confirmed' },
      { userId: inv2.id, dealId: deal5.id, amount: 8000,  status: 'confirmed' }
    ]);
    console.log('Investments created');

    // ─── INTERESTS ───────────────────────────────────────────
    await Interest.bulkCreate([
      { userId: inv1.id, dealId: deal3.id, amount: 10000 },
      { userId: inv2.id, dealId: deal2.id, amount: 20000 },
      { userId: inv3.id, dealId: deal2.id, amount: 15000 },
      { userId: inv1.id, dealId: deal4.id, amount: 30000 },
      { userId: inv2.id, dealId: deal4.id, amount: 5000  }
    ]);
    console.log('Interests created');

    console.log('\n All seed data inserted!\n');
    console.log('─────────────────────────────────────────');
    console.log('All users have password: Password@123');
    console.log('─────────────────────────────────────────');
    console.log('Admin     → admin@platform.com');
    console.log('Corporate → techcorp@corporate.com');
    console.log('Corporate → greenenergy@corporate.com');
    console.log('Investor  → rahul@investor.com');
    console.log('Investor  → priya@investor.com');
    console.log('Investor  → arjun@investor.com');
    console.log('─────────────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
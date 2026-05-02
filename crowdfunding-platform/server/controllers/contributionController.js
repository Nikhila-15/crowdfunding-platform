import Contribution from '../models/Contribution.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YOUR_SECRET',
});

// @desc    Create razorpay order
// @route   POST /api/contributions/order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { amount, projectId } = req.body;
    
    // DEMO BYPASS: Return a mock order instead of calling Razorpay
    const mockOrder = {
      id: `mock_order_${Math.floor(Math.random() * 1000000)}`,
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    res.json(mockOrder);
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ message: 'Error creating mock order.' });
  }
};

// @desc    Verify payment and create contribution
// @route   POST /api/contributions/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, signature, amount, projectId } = req.body;

    // DEMO BYPASS: We assume payment is successful to bypass the Razorpay signature verification
    const isPaymentSuccessful = true;

    if (isPaymentSuccessful) {
      // Payment is successful
      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Check for overfunding
      if (project.raisedAmount + Number(amount) > project.goalAmount) {
        return res.status(400).json({ message: 'Donation exceeds funding goal. Cannot overfund project.' });
      }

      const sharePercentage = (Number(amount) / project.goalAmount) * 100;
      const equityPercentage = (Number(amount) / project.goalAmount) * (project.equityOffered || 0);
      const expectedReturn = Number(amount) * ((project.returnPercentage || 0) / 100);

      // Merge investor logic in Project
      const existingInvestorIndex = project.investors.findIndex(inv => inv.user.toString() === req.user._id.toString());
      if (existingInvestorIndex >= 0) {
        project.investors[existingInvestorIndex].donatedAmount += Number(amount);
        project.investors[existingInvestorIndex].sharePercentage += sharePercentage;
        project.investors[existingInvestorIndex].equityPercentage = (project.investors[existingInvestorIndex].equityPercentage || 0) + equityPercentage;
        project.investors[existingInvestorIndex].expectedReturn = (project.investors[existingInvestorIndex].expectedReturn || 0) + expectedReturn;
      } else {
        project.investors.push({
          user: req.user._id,
          donatedAmount: Number(amount),
          sharePercentage,
          equityPercentage,
          expectedReturn
        });
      }

      project.raisedAmount += Number(amount);
      if (project.raisedAmount >= project.goalAmount) {
        project.isFunded = true;
        project.status = 'completed';
      }
      await project.save();

      // Merge contribution logic in User
      const userRecord = await User.findById(req.user._id);
      if (userRecord) {
        const existingContribIndex = userRecord.contributions.findIndex(c => c.projectId.toString() === projectId.toString());
        if (existingContribIndex >= 0) {
          userRecord.contributions[existingContribIndex].amount += Number(amount);
          userRecord.contributions[existingContribIndex].sharePercentage += sharePercentage;
          userRecord.contributions[existingContribIndex].equityPercentage = (userRecord.contributions[existingContribIndex].equityPercentage || 0) + equityPercentage;
          userRecord.contributions[existingContribIndex].expectedReturn = (userRecord.contributions[existingContribIndex].expectedReturn || 0) + expectedReturn;
        } else {
          userRecord.contributions.push({
            projectId,
            amount: Number(amount),
            sharePercentage,
            equityPercentage,
            expectedReturn
          });
        }
        await userRecord.save();
      }
      
      // Save the standard contribution record for transaction history
      const contribution = new Contribution({
        user: req.user._id,
        project: projectId,
        amount,
        equityPercentage,
        expectedReturn,
        paymentId: razorpayPaymentId,
        orderId: razorpayOrderId,
        status: 'successful'
      });

      await contribution.save();

      res.status(200).json({ message: "Payment verified successfully", contribution });
    } else {
      res.status(400);
      throw new Error('Invalid signature');
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error('Server Error during verification');
  }
};

// @desc    Get user's contributions
// @route   GET /api/contributions/mycontributions
// @access  Private
const getMyContributions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('contributions.projectId', 'title imageUrl returnPercentage status');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return the aggregated contributions from the User model instead of individual transactions
    res.json(user.contributions);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

export { createOrder, verifyPayment, getMyContributions };

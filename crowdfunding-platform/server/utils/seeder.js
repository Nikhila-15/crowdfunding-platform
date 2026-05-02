import mongoose from 'mongoose';
import User from '../models/User.js';
import Project from '../models/Project.js';

const seedDemoData = async () => {
  try {
    const userCount = await User.countDocuments();
    const projectCount = await Project.countDocuments();

    if (userCount === 0 && projectCount === 0) {
      console.log('Database is empty. Seeding demo data...');

      // 1. Create Demo Users
      // The User model has a pre-save hook that hashes passwords automatically
      const users = await User.create([
        {
          name: 'Demo Entrepreneur',
          email: 'entrepreneur@demo.com',
          password: 'password123',
          role: 'entrepreneur',
        },
        {
          name: 'Demo Investor',
          email: 'investor@demo.com',
          password: 'password123',
          role: 'investor',
        }
      ]);

      const entrepreneurId = users[0]._id;

      // 2. Create Demo Projects
      const demoProjects = [
        {
          title: 'AI-Based Healthcare App',
          description: 'An AI-driven mobile application to provide preliminary medical diagnoses and connect patients with specialists seamlessly.',
          goalAmount: 500000,
          raisedAmount: 150000,
          returnPercentage: 15,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          category: 'Technology',
          imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000',
          creator: entrepreneurId,
          status: 'active',
          riskIndicator: 'Low',
          story: {
            problem: 'Millions of people in rural areas lack access to preliminary medical advice, leading to delayed diagnoses for preventable diseases.',
            solution: 'Our AI app uses state-of-the-art machine learning models to analyze symptoms and connect users to certified doctors instantly.',
            market: 'The global telemedicine market is expected to reach $460 Billion by 2030, presenting massive growth opportunities.',
            vision: 'We envision a world where high-quality healthcare is accessible to everyone with a smartphone.'
          }
        },
        {
          title: 'Smart Farming IoT System',
          description: 'A comprehensive IoT solution for farmers to monitor soil moisture, temperature, and automate irrigation to increase crop yield.',
          goalAmount: 300000,
          raisedAmount: 300000,
          returnPercentage: 20,
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Active but funded
          category: 'Technology',
          imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=1000',
          creator: entrepreneurId,
          status: 'completed',
          isFunded: true,
          riskIndicator: 'Medium',
          story: {
            problem: 'Farmers lose up to 30% of their crop yields due to inefficient water usage and unpredictable climate changes.',
            solution: 'Our IoT sensors provide real-time data to a mobile dashboard, automatically controlling irrigation systems based on soil needs.',
            market: 'Smart agriculture is an expanding sector desperately needing affordable, plug-and-play solutions.',
            vision: 'To empower farmers worldwide with precision agriculture tools.'
          }
        },
        {
          title: 'EdTech Learning Platform',
          description: 'A revolutionary online learning platform focusing on interactive coding courses for children.',
          goalAmount: 200000,
          raisedAmount: 190000, // Almost funded (95%)
          returnPercentage: 10,
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
          category: 'Education',
          imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000',
          creator: entrepreneurId,
          status: 'active',
          riskIndicator: 'Low',
          story: {
            problem: 'Traditional coding education is often too academic and boring for children under 12.',
            solution: 'We built a gamified platform where kids learn logic by playing interactive stories and building their own mini-games.',
            market: 'The K-12 online education market is booming, with parents actively seeking STEM-focused alternatives.',
            vision: 'To make coding as fundamental and accessible as reading and writing.'
          }
        },
        {
          title: 'Sustainable Energy Startup',
          description: 'Developing affordable and efficient solar panels for residential use in developing nations.',
          goalAmount: 1000000,
          raisedAmount: 200000,
          returnPercentage: 25,
          deadline: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // Expired
          category: 'Environment',
          imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=1000',
          creator: entrepreneurId,
          status: 'expired',
          riskIndicator: 'High',
          story: {
            problem: 'High initial costs prevent widespread adoption of solar technology in developing nations.',
            solution: 'Using innovative materials, we reduced manufacturing costs by 40% while maintaining 90% efficiency.',
            market: 'Millions of homes in developing nations suffer from grid instability, creating a huge demand for independent power.',
            vision: 'Clean, reliable energy for every home, regardless of geographic or economic barriers.'
          }
        }
      ];

      await Project.insertMany(demoProjects);
      console.log('Demo Data Seeded Successfully!');
    }
  } catch (error) {
    console.error('Error seeding demo data:', error.message);
  }
};

export default seedDemoData;

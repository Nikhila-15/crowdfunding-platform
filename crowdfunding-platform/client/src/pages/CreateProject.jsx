import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../services/projectService';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalAmount: '',
    returnPercentage: '',
    equityOffered: '',
    category: 'Technology',
    imageUrl: '',
    deadline: '',
    websiteLink: '',
    riskIndicator: 'Medium',
    story: {
      problem: '',
      solution: '',
      market: '',
      vision: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name.startsWith('story.')) {
      const field = e.target.name.split('.')[1];
      setFormData({
        ...formData,
        story: {
          ...formData.story,
          [field]: e.target.value
        }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createProject(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Start a Project</h1>
        {error && <div className="text-red-500 bg-red-50 p-3 rounded mb-6">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g. Revolutionary Smart Watch"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Tell us about your project..."
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Amount (₹)</label>
              <input
                type="number"
                name="goalAmount"
                required
                min="100"
                value={formData.goalAmount}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="10000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Percentage (%)</label>
              <input
                type="number"
                name="returnPercentage"
                required
                min="0"
                max="100"
                step="0.01"
                value={formData.returnPercentage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. 15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equity Offered (%)</label>
              <input
                type="number"
                name="equityOffered"
                required
                min="0"
                max="100"
                step="0.01"
                value={formData.equityOffered}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. 50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Technology">Technology</option>
                <option value="Art">Art</option>
                <option value="Design">Design</option>
                <option value="Film">Film & Video</option>
                <option value="Food">Food</option>
                <option value="Games">Games</option>
                <option value="Music">Music</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Risk Indicator</label>
              <select
                name="riskIndicator"
                value={formData.riskIndicator}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Low">Low Risk</option>
                <option value="Medium">Medium Risk</option>
                <option value="High">High Risk</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Project Story</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Problem Statement</label>
                <textarea
                  name="story.problem"
                  rows="3"
                  value={formData.story.problem}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="What problem does this project solve?"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Solution</label>
                <textarea
                  name="story.solution"
                  rows="3"
                  value={formData.story.solution}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="How does your project solve this problem?"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Market Opportunity</label>
                <textarea
                  name="story.market"
                  rows="3"
                  value={formData.story.market}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Who is the target audience? How big is the market?"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Founder Vision</label>
                <textarea
                  name="story.vision"
                  rows="3"
                  value={formData.story.vision}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="What is your long-term vision?"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-md hover:bg-primary-700 transition-colors disabled:bg-primary-400"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;

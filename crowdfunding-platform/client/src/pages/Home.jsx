import { useEffect, useState } from 'react';
import { getProjects } from '../services/projectService';
import ProjectCard from '../components/ProjectCard';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Fund the Future. <span className="text-primary-600">Share the Success.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            The first equity-based crowdfunding platform where startup owners raise funds and investors earn returns based on profit sharing.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register" className="bg-primary-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-primary-700 hover:shadow-xl transition-all">
              Join Now
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Sections for Roles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-10 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">For Entrepreneurs</h2>
            <ul className="space-y-3 text-indigo-800 mb-8 list-disc list-inside">
              <li>Launch your startup idea instantly</li>
              <li>Set a funding goal and deadline</li>
              <li>Offer investors a fixed return percentage</li>
              <li>Manage your investors via a clean dashboard</li>
            </ul>
            <Link to="/register" className="inline-block bg-indigo-600 text-white font-medium py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors">
              Start Raising Funds
            </Link>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-teal-50 p-10 rounded-2xl border border-green-100 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-3xl font-bold text-green-900 mb-4">For Investors</h2>
            <ul className="space-y-3 text-green-800 mb-8 list-disc list-inside">
              <li>Browse high-potential startups</li>
              <li>Calculate your expected return instantly</li>
              <li>Invest securely and track progress</li>
              <li>Earn a share of the project's profit</li>
            </ul>
            <a href="#projects" className="inline-block bg-green-600 text-white font-medium py-2 px-6 rounded-md hover:bg-green-700 transition-colors">
              Start Investing
            </a>
          </div>
        </div>

        {/* Featured Projects */}
        <div id="projects">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Active Projects</h2>
          {loading ? (
            <Loader />
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-md text-center">{error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
              {projects.length === 0 && (
                <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                  No projects found. Be the first to create one!
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

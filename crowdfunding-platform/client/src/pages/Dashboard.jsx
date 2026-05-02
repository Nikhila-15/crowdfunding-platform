import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getMyProjects, deleteProject } from '../services/projectService';
import { getMyContributions } from '../services/contributionService';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.role === 'entrepreneur') {
          const data = await getMyProjects();
          setProjects(data);
        } else {
          const data = await getMyContributions();
          setContributions(data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        setProjects(projects.filter(p => p._id !== projectId));
      } catch (error) {
        console.error(error);
        alert('Failed to delete project');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name} 
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
              {user?.role}
            </span>
          </p>
        </div>
        {user?.role === 'entrepreneur' && (
          <div className="mt-4 md:mt-0">
            <Link
              to="/create-project"
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 font-medium inline-block"
            >
              Create New Project
            </Link>
          </div>
        )}
      </div>

      {user?.role === 'entrepreneur' ? (
        // Entrepreneur Dashboard
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Projects</h2>
          {projects.length > 0 ? (
            <div className="space-y-12">
              {projects.map((project) => (
                <div key={project._id} className="bg-white shadow rounded-xl overflow-hidden border border-gray-100">
                  <div className="p-6 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:justify-between md:items-center relative">
                    <button 
                      onClick={() => handleDelete(project._id)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-white p-1 rounded-full shadow-sm"
                      title="Delete Project"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 pr-8">
                        <Link to={`/projects/${project._id}`} className="hover:text-primary-600">{project.title}</Link>
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Status: <span className={`font-semibold ${project.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>{project.status.toUpperCase()}</span></p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-6 text-sm">
                      <div>
                        <span className="block text-gray-500">Goal</span>
                        <span className="font-semibold text-gray-900">₹{project.goalAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Raised</span>
                        <span className="font-semibold text-green-600">₹{project.raisedAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Return</span>
                        <span className="font-semibold text-gray-900">{project.returnPercentage}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Investors ({project.investors.length})</h4>
                    {project.investors.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investor</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Donated</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equity</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Return</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {project.investors.map((inv, idx) => (
                              <tr key={idx}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {inv.user.name} <br/><span className="text-gray-500 font-normal">{inv.user.email}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  ₹{inv.donatedAmount.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {(inv.equityPercentage || 0).toFixed(2)}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                                  ₹{inv.expectedReturn ? inv.expectedReturn.toLocaleString() : (inv.donatedAmount * (project.returnPercentage / 100)).toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No investors yet.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-1">No projects created</h3>
              <p className="text-gray-500 mb-4">You haven't created any campaigns yet.</p>
              <Link to="/create-project" className="text-primary-600 font-medium hover:text-primary-700">
                Start your first project &rarr;
              </Link>
            </div>
          )}
        </div>
      ) : (
        // Investor Dashboard
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Investments</h2>
          
          {contributions.length > 0 ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Total Invested</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    ₹{contributions.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Total Expected Return</p>
                  <p className="mt-2 text-3xl font-bold text-green-600">
                    ₹{contributions.reduce((acc, curr) => acc + (curr.expectedReturn || (curr.amount * (curr.projectId?.returnPercentage || 0) / 100)), 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Total Equity Owned</p>
                  <p className="mt-2 text-3xl font-bold text-purple-600">
                    {contributions.reduce((acc, curr) => acc + (curr.equityPercentage || 0), 0).toFixed(2)}%
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Projects Funded</p>
                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    {contributions.length}
                  </p>
                </div>
              </div>

              {/* Contribution History */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-100">
                <ul className="divide-y divide-gray-200">
                  {contributions.map((contribution) => (
                    <li key={contribution._id}>
                      <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-bold text-primary-600 truncate">
                            {contribution.projectId ? (
                              <Link to={`/projects/${contribution.projectId._id}`}>{contribution.projectId.title}</Link>
                            ) : 'Project Removed'}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${contribution.projectId?.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                              {contribution.projectId?.status ? contribution.projectId.status.toUpperCase() : 'UNKNOWN'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 sm:flex sm:justify-between">
                          <div className="sm:flex sm:space-x-8">
                            <p className="flex items-center text-sm text-gray-500">
                              <span className="font-semibold text-gray-700 mr-2">Invested:</span> ₹{contribution.amount.toLocaleString()}
                            </p>
                            <p className="flex items-center text-sm text-gray-500 mt-2 sm:mt-0">
                              <span className="font-semibold text-gray-700 mr-2">Equity:</span> {(contribution.equityPercentage || 0).toFixed(2)}%
                            </p>
                            <p className="flex items-center text-sm text-green-600 font-medium mt-2 sm:mt-0">
                              <span className="font-semibold text-gray-700 mr-2">Expected Return:</span> 
                              ₹{(contribution.expectedReturn || (contribution.amount * (contribution.projectId?.returnPercentage || 0) / 100)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-1">No investments yet</h3>
              <p className="text-gray-500 mb-4">You haven't backed any projects yet.</p>
              <Link to="/" className="text-primary-600 font-medium hover:text-primary-700">
                Discover projects to fund &rarr;
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

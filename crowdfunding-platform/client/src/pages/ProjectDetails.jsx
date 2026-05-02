import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectDetails, addProjectProfit } from '../services/projectService';
import { createContributionOrder, verifyContributionPayment } from '../services/contributionService';
import useAuth from '../hooks/useAuth';
import ProgressBar from '../components/ProgressBar';
import Loader from '../components/Loader';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contributionAmount, setContributionAmount] = useState('');
  const [fundingLoading, setFundingLoading] = useState(false);
  const [profitAmount, setProfitAmount] = useState('');
  const [addingProfit, setAddingProfit] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectDetails(id);
        setProject(data);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch project details');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleFund = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to fund this project");
      return;
    }
    if (!contributionAmount || isNaN(contributionAmount) || Number(contributionAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    if (project.raisedAmount + Number(contributionAmount) > project.goalAmount) {
      alert(`Amount exceeds the funding goal. You can only donate up to ₹${project.goalAmount - project.raisedAmount}`);
      return;
    }

    setFundingLoading(true);
    try {
      // Create Mock Razorpay order
      const order = await createContributionOrder(Number(contributionAmount), id);

      // DEMO BYPASS: Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Verify payment directly without opening Razorpay popup
      await verifyContributionPayment({
        razorpayOrderId: order.id,
        razorpayPaymentId: `mock_payment_${Math.floor(Math.random() * 1000000)}`,
        signature: 'mock_signature',
        amount: contributionAmount,
        projectId: id
      });
      
      alert('Mock Payment successful! Progress updated.');
      
      // Refresh project data to show updated progress
      const data = await getProjectDetails(id);
      setProject(data);
      setContributionAmount('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error initiating payment');
    } finally {
      setFundingLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!project) return <div className="text-center py-12">Project not found</div>;

  const percentage = Math.min((project.raisedAmount / project.goalAmount) * 100, 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24)));
  const userInvestment = user && project.investors ? project.investors.find(inv => inv.user === user._id) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{project.title}</h1>
        <p className="text-xl text-gray-600">{project.description}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <div>
            Created by <span className="font-semibold text-gray-900">{project.creator.name}</span> in <span className="text-primary-600 font-medium">{project.category}</span>
          </div>
          {project.riskIndicator && (
            <div className={`px-3 py-1 rounded-full font-semibold text-xs border ${
              project.riskIndicator === 'Low' ? 'bg-green-50 text-green-700 border-green-200' :
              project.riskIndicator === 'Medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              'bg-red-50 text-red-700 border-red-200'
            }`}>
              {project.riskIndicator} Risk
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
          <img 
            src={project.imageUrl || 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=800'} 
            alt={project.title} 
            className="w-full rounded-xl shadow-md object-cover h-[400px]"
          />
          <div className="mt-8 prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">About this project</h2>
            <p className="text-gray-700 whitespace-pre-line text-lg">{project.description}</p>
            
            {project.story && (project.story.problem || project.story.solution || project.story.market || project.story.vision) && (
              <div className="mt-10 space-y-8 border-t border-gray-100 pt-8">
                {project.story.problem && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <span className="bg-red-100 text-red-600 p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      </span>
                      The Problem
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{project.story.problem}</p>
                  </div>
                )}
                {project.story.solution && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <span className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </span>
                      The Solution
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{project.story.solution}</p>
                  </div>
                )}
                {project.story.market && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                      </span>
                      Market Opportunity
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{project.story.market}</p>
                  </div>
                )}
                {project.story.vision && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      </span>
                      Founder Vision
                    </h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{project.story.vision}</p>
                  </div>
                )}
              </div>
            )}

            {project.websiteLink && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <a href={project.websiteLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-bold bg-primary-50 px-4 py-2 rounded-lg transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  Visit Project Website
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-xl shadow-md sticky top-6">
            <ProgressBar percentage={percentage} />
            <div className="mt-6">
              <div className="text-4xl font-bold text-gray-900">₹{project.raisedAmount.toLocaleString()}</div>
              <div className="text-gray-500 mt-1">pledged of ₹{project.goalAmount.toLocaleString()} goal</div>
              {project.equityOffered > 0 && (
                <div className="text-gray-500 mt-1"><span className="font-bold text-gray-700">{project.equityOffered}%</span> Equity Offered</div>
              )}
            </div>
            <div className="mt-6 flex justify-between text-lg">
              <div>
                <span className="font-bold text-gray-900">{percentage.toFixed(0)}%</span>
                <span className="text-gray-500 block text-sm">funded</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-gray-900">{daysLeft}</span>
                <span className="text-gray-500 block text-sm">days left</span>
              </div>
            </div>

            <div className="mt-8 border-t pt-8">
              {project.status === 'completed' || percentage >= 100 ? (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                  <h3 className="text-2xl font-bold text-green-700 mb-2">✅ Funding Complete</h3>
                  <p className="text-green-800 font-medium">Total Raised: ₹{project.raisedAmount.toLocaleString()}</p>
                </div>
              ) : project.status === 'expired' ? (
                <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
                  <h3 className="text-2xl font-bold text-red-700 mb-2">⏳ Campaign Expired</h3>
                  <p className="text-red-800 font-medium">This project is no longer accepting funds.</p>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-lg mb-4">Fund this project</h3>
                  <form onSubmit={handleFund}>
                    <div className="mb-4">
                      <div className="flex items-center">
                        <span className="bg-gray-100 text-gray-600 px-4 py-3 rounded-l-md border border-r-0 border-gray-300 font-semibold">₹</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          required
                          value={contributionAmount}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, '');
                            // Optional: Cap it at max remaining
                            const maxAllowed = project.goalAmount - project.raisedAmount;
                            if (Number(val) > maxAllowed) {
                              val = maxAllowed.toString();
                            }
                            setContributionAmount(val);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-r-md focus:ring-primary-500 focus:border-primary-500 outline-none font-semibold text-lg"
                          placeholder="Enter amount"
                        />
                      </div>
                      
                      {/* Slider Input Enhancement */}
                      <div className="mt-4">
                        <input
                          type="range"
                          min="0"
                          max={project.goalAmount - project.raisedAmount}
                          step="100"
                          value={contributionAmount || 0}
                          onChange={(e) => setContributionAmount(e.target.value)}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>₹0</span>
                          <span>Max: ₹{(project.goalAmount - project.raisedAmount).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Live Return Preview Card */}
                    {contributionAmount && Number(contributionAmount) > 0 && percentage < 100 && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-lg shadow-sm">
                        <h4 className="font-semibold text-blue-900 mb-2">If you donate ₹{Number(contributionAmount).toLocaleString()}:</h4>
                        <ul className="space-y-1 text-sm text-blue-800">
                          <li className="flex justify-between">
                            <span>You will own:</span>
                            <span className="font-bold">{((Number(contributionAmount) / project.goalAmount) * (project.equityOffered || 0)).toFixed(2)}% equity</span>
                          </li>
                          <li className="flex justify-between pt-1 border-t border-blue-100/50 mt-1">
                            <span>Estimated Return:</span>
                            <span className="font-bold text-green-700">
                              ₹{(Number(contributionAmount) * (project.returnPercentage / 100)).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={fundingLoading || daysLeft === 0 || percentage >= 100 || project.status === 'expired'}
                      className="w-full bg-primary-600 text-white font-bold py-4 rounded-md hover:bg-primary-700 transition-colors disabled:bg-primary-400 disabled:cursor-not-allowed text-lg"
                    >
                      {fundingLoading ? 'Processing...' : (project.status === 'expired' || daysLeft === 0 || percentage >= 100) ? 'Project Closed' : 'Donate'}
                    </button>
                  </form>

                  {!user && (
                    <p className="text-sm text-gray-500 mt-3 text-center">
                      You must be logged in to donate to this project.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Post-Funding View: Your Contribution Summary */}
            {userInvestment && (
              <div className="mt-6 border-t pt-6">
                <h3 className="font-bold text-lg mb-4 text-indigo-700">Your Contribution Summary</h3>
                <div className="bg-indigo-50 p-5 rounded-md border border-indigo-200 shadow-sm">
                  <ul className="space-y-3 text-sm text-indigo-900">
                    <li className="flex justify-between items-center">
                      <span className="text-indigo-800">You Donated:</span>
                      <span className="font-bold text-base">₹{userInvestment.donatedAmount.toLocaleString()}</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-indigo-800">Your Equity:</span>
                      <span className="font-bold text-base bg-white px-2 py-1 rounded text-indigo-700 border border-indigo-100">{(userInvestment.equityPercentage || 0).toFixed(2)}%</span>
                    </li>
                    <li className="flex justify-between items-center pt-3 border-t border-indigo-200 mt-2">
                      <span className="text-indigo-800 font-medium">Your Expected Return:</span>
                      <span className="font-bold text-lg text-green-700">
                        ₹{(userInvestment.expectedReturn || (userInvestment.donatedAmount * (project.returnPercentage / 100))).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Creator Tools: Add Profit Section */}
            {user && project.creator._id === user._id && (
              <div className="mt-8 border-t pt-8">
                <h3 className="font-bold text-lg mb-4 text-green-700">Creator Dashboard</h3>
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <p className="text-sm text-green-800 mb-3">
                    Add profit to this project. This will be distributed to your investors based on their share percentage.
                  </p>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!profitAmount || Number(profitAmount) <= 0) return;
                    setAddingProfit(true);
                    try {
                      await addProjectProfit(id, profitAmount);
                      alert('Profit added successfully!');
                      setProfitAmount('');
                      const data = await getProjectDetails(id);
                      setProject(data);
                    } catch (error) {
                      console.error(error);
                      alert('Failed to add profit');
                    } finally {
                      setAddingProfit(false);
                    }
                  }}>
                    <div className="flex items-center mb-3">
                      <span className="bg-white text-gray-600 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md">₹</span>
                      <input
                        type="number"
                        required
                        value={profitAmount}
                        onChange={(e) => setProfitAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:border-green-500"
                        placeholder="Profit amount"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={addingProfit}
                      className="w-full bg-green-600 text-white font-medium py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {addingProfit ? 'Adding...' : 'Distribute Profit'}
                    </button>
                  </form>
                </div>
                {project.totalProfit > 0 && (
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    Total Profit Distributed: <span className="font-semibold text-green-600">₹{project.totalProfit.toLocaleString()}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;

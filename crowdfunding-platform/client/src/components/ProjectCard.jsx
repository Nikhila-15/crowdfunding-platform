import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';

const ProjectCard = ({ project }) => {
  const percentage = Math.min((project.raisedAmount / project.goalAmount) * 100, 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <Link to={`/projects/${project._id}`} className="relative">
        <img 
          src={project.imageUrl || 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=600'} 
          alt={project.title} 
          className="w-full h-48 object-cover"
        />
        <span className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded shadow-sm ${
          project.status === 'completed' || (project.raisedAmount >= project.goalAmount) 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : project.status === 'expired'
          ? 'bg-red-100 text-red-800 border border-red-200'
          : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
          {project.status === 'completed' || (project.raisedAmount >= project.goalAmount) ? 'COMPLETED' : project.status === 'expired' ? 'EXPIRED' : 'ACTIVE'}
        </span>
      </Link>
      <div className="p-5 flex-grow flex flex-col">
        <div className="uppercase tracking-wide text-xs text-primary-600 font-semibold mb-1">
          {project.category}
        </div>
        <Link to={`/projects/${project._id}`} className="block mt-1 text-lg leading-tight font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-2">
          {project.title}
        </Link>
        <p className="mt-2 text-gray-600 text-sm line-clamp-2 flex-grow">
          {project.description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <ProgressBar percentage={percentage} />
          
          <div className="flex justify-between items-center mt-3">
            <div>
              <p className="text-lg font-bold text-gray-900">₹{project.raisedAmount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">pledged of ₹{project.goalAmount.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{percentage.toFixed(0)}%</p>
              <p className="text-xs text-gray-500">funded</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {project.status === 'expired' ? '0 days left' : `${daysLeft} days left`}
            </div>
            <div className="flex items-center font-medium text-primary-600">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {project.investors ? project.investors.length : 0} investors
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

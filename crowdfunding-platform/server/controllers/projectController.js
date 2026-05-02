import Project from '../models/Project.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    // Automatically update expired projects before fetching
    await Project.updateMany(
      { status: 'active', deadline: { $lt: new Date() } },
      { $set: { status: 'expired' } }
    );

    const projects = await Project.find({}).populate('creator', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('creator', 'name email');
    
    // Auto expire check for single project
    if (project && project.status === 'active' && new Date(project.deadline) < new Date()) {
      project.status = 'expired';
      await project.save();
    }
    if (project) {
      res.json(project);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, description, goalAmount, returnPercentage, equityOffered, category, imageUrl, deadline, websiteLink, story, riskIndicator } = req.body;

    const project = new Project({
      title,
      description,
      goalAmount,
      returnPercentage,
      equityOffered,
      category,
      imageUrl,
      deadline,
      websiteLink,
      story: story || undefined,
      riskIndicator: riskIndicator || 'Medium',
      creator: req.user._id,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(400);
    throw new Error('Invalid project data');
  }
};

// @desc    Get user's projects
// @route   GET /api/projects/user/myprojects
// @access  Private
const getMyProjects = async (req, res) => {
  try {
    await Project.updateMany(
      { status: 'active', deadline: { $lt: new Date() }, creator: req.user._id },
      { $set: { status: 'expired' } }
    );
    const projects = await Project.find({ creator: req.user._id }).populate('investors.user', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Get project investors
// @route   GET /api/projects/:id/investors
// @access  Public
const getProjectInvestors = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('investors.user', 'name email');
    if (project) {
      res.json(project.investors);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Add profit to project
// @route   POST /api/projects/:id/add-profit
// @access  Private (Creator Only)
const addProjectProfit = async (req, res) => {
  try {
    const { amount } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user is the creator
    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized as creator' });
    }

    project.totalProfit += Number(amount);
    const updatedProject = await project.save();
    
    res.json(updatedProject);
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private (Creator Only)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized as creator' });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project removed successfully' });
  } catch (error) {
    res.status(500);
    throw new Error('Server Error');
  }
};

export { getProjects, getProjectById, createProject, getMyProjects, getProjectInvestors, addProjectProfit, deleteProject };

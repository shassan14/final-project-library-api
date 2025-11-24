const Project = require('./Project');
const Task = require('../models/task');
const Comment = require('./Comment');
const User = require('./User');

// Project associations
Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
Project.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Task associations
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments' });

// Comment associations
Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User associations
User.hasMany(Project, { foreignKey: 'userId', as: 'projects' });
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });

module.exports = {
  Project,
  Task,
  Comment,
  User
};
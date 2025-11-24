const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Task title is required' }
    }
  },
  status: {
    type: DataTypes.ENUM('todo', 'doing', 'done'),
    defaultValue: 'todo',
    validate: {
      isIn: {
        args: [['todo', 'doing', 'done']],
        msg: 'Status must be one of: todo, doing, done'
      }
    }
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    validate: {
      isDate: { msg: 'Due date must be a valid date' },
      isAfterCurrent(value) {
        if (value && new Date(value) < new Date().setHours(0, 0, 0, 0)) {
          throw new Error('Due date cannot be in the past');
        }
      }
    }
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  tableName: 'tasks',
  timestamps: true
});

module.exports = Task;
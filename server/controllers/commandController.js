const Command = require('../models/Command');

exports.saveCommand = async (data) => {
  try {
    const command = new Command(data);
    return await command.save();
  } catch (error) {
    console.error('Save command error:', error.message);
    return null;
  }
};

exports.getAllCommands = async (page = 1, limit = 20) => {
  try {
    return await Command.find()
      .sort({ executedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  } catch (error) {
    console.error('Get commands error:', error.message);
    return [];
  }
};

exports.deleteAllCommands = async () => {
  try {
    return await Command.deleteMany({});
  } catch (error) {
    console.error('Delete commands error:', error.message);
    return null;
  }
};

exports.getCommandById = async (id) => {
  try {
    return await Command.findById(id).lean();
  } catch (error) {
    console.error('Get command error:', error.message);
    return null;
  }
};
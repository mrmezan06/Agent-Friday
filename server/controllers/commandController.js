const commands = [];

exports.saveCommand = async (data) => {
  try {
    const command = {
      _id: Date.now().toString(),
      ...data,
      executedAt: new Date(),
    };
    commands.unshift(command);
    if (commands.length > 200) commands.length = 200;
    return command;
  } catch (error) {
    console.error('Save command error:', error.message);
    return null;
  }
};

exports.getAllCommands = async (page = 1, limit = 20) => {
  try {
    const start = (page - 1) * limit;
    return commands.slice(start, start + limit);
  } catch (error) {
    console.error('Get commands error:', error.message);
    return [];
  }
};

exports.deleteAllCommands = async () => {
  try {
    commands.length = 0;
    return { deletedCount: 0 };
  } catch (error) {
    console.error('Delete commands error:', error.message);
    return null;
  }
};

exports.getCommandById = async (id) => {
  try {
    return commands.find((c) => c._id === id) || null;
  } catch (error) {
    console.error('Get command error:', error.message);
    return null;
  }
};
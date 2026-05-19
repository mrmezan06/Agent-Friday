const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['search', 'question', 'weather', 'open_website', 'close_tab', 'execute_only', 'other'],
    required: true
  },
  command: {
    type: String,
    required: true
  },
  query: String,
  result: mongoose.Schema.Types.Mixed,
  sources: [{
    title: String,
    url: String
  }],
  sourceType: {
    type: String,
    enum: ['web_search', 'groq_llm', 'weather', 'execute_only', 'other'],
    default: 'execute_only'
  },
  spokenResponse: String,
  metadata: mongoose.Schema.Types.Mixed,
  executedAt: {
    type: Date,
    default: Date.now
  }
});

commandSchema.index({ executedAt: -1 });

module.exports = mongoose.model('Command', commandSchema);
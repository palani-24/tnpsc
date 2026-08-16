const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  group: { type: String, required: true, enum: ['Group 1', 'Group 2', 'Group 3', 'All Groups'] },
  subject: { type: String, required: true },
  type: { type: String, required: true, enum: ['Notes', 'Syllabus', 'PYQ', 'Model Papers', 'Guides'] },
  description: { type: String, default: '' },
  fileName: { type: String, required: true },
  filePath: { type: String, default: '' },
  fileSize: { type: String, default: 'PDF Document' },
  downloads: { type: Number, default: 0 },
  upvotes: { type: Number, default: 0 },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);

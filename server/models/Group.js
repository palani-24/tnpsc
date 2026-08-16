const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  fullName: { type: String, default: '' },
  badge: { type: String, default: 'Official' },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  eligibility: {
    education: { type: String, default: '' },
    ageLimit: { type: String, default: '' },
    attempts: { type: String, default: 'Unlimited' }
  },
  jobPosts: [{
    post: String,
    department: String,
    payScale: String,
    responsibilities: String
  }],
  examPattern: {
    prelims: { type: Object },
    mains: { type: Object }
  },
  roadmap: [{ type: String }],
  pyqs: [{
    title: String,
    year: String,
    subject: String,
    downloadUrl: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);

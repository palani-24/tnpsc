const path = require('path');
const fs = require('fs');
const Group = require('./models/Group');
const Resource = require('./models/Resource');

async function seedDatabase() {
  try {
    const initialDataPath = path.join(__dirname, '../data/initialData.json');
    if (!fs.existsSync(initialDataPath)) return;

    const raw = fs.readFileSync(initialDataPath, 'utf-8');
    const localData = JSON.parse(raw);

    // Seed Groups
    if (localData.groups && localData.groups.length > 0) {
      const groupCount = await Group.countDocuments();
      if (groupCount === 0) {
        await Group.insertMany(localData.groups);
        console.log(`[MongoDB Atlas] Successfully seeded ${localData.groups.length} TNPSC Exam Groups!`);
      }
    }

    // Seed Resources
    if (localData.resources && localData.resources.length > 0) {
      const resourceCount = await Resource.countDocuments();
      if (resourceCount === 0) {
        await Resource.insertMany(localData.resources);
        console.log(`[MongoDB Atlas] Successfully seeded ${localData.resources.length} study resources!`);
      }
    }
  } catch (err) {
    console.error('[MongoDB Atlas Seed Warning]:', err.message);
  }
}

module.exports = seedDatabase;

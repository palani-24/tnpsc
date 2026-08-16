const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const initialDataPath = path.join(__dirname, '../../data/initialData.json');
let localData = { groups: [], syllabus: [], pyqs: [], resources: [], faqs: [] };

try {
  const raw = fs.readFileSync(initialDataPath, 'utf-8');
  localData = JSON.parse(raw);
} catch (err) {
  console.error('Error loading initial data JSON:', err.message);
}

// Multer storage for Community File Uploads
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '_'));
  }
});
const upload = multer({ storage });

// Mongoose Model (Optional connection)
let ResourceModel = null;
try {
  ResourceModel = require('../models/Resource');
} catch (e) {
  console.log('Mongoose model not initialized, using JSON store.');
}

// Helper to save local JSON back to disk
function persistLocalData() {
  try {
    fs.writeFileSync(initialDataPath, JSON.stringify(localData, null, 2));
  } catch (err) {
    console.error('Failed to write local JSON:', err.message);
  }
}

// GET /api/groups
router.get('/groups', (req, res) => {
  res.json(localData.groups || []);
});

// GET /api/groups/:id
router.get('/groups/:id', (req, res) => {
  const group = (localData.groups || []).find(g => g.id === req.params.id || g.code.toLowerCase().replace(/\s+/g, '') === req.params.id.toLowerCase());
  if (group) {
    res.json(group);
  } else {
    res.status(404).json({ error: 'Group not found' });
  }
});

// GET /api/syllabus
router.get('/syllabus', (req, res) => {
  res.json(localData.syllabus || []);
});

// GET /api/pyqs
router.get('/pyqs', (req, res) => {
  let list = localData.pyqs || [];
  const { group, year } = req.query;
  if (group && group !== 'All') {
    list = list.filter(p => p.group.toLowerCase().includes(group.toLowerCase()));
  }
  if (year && year !== 'All') {
    list = list.filter(p => p.year === year);
  }
  res.json(list);
});

// GET /api/faqs
router.get('/faqs', (req, res) => {
  res.json(localData.faqs || []);
});

// GET /api/guidance
router.get('/guidance', (req, res) => {
  res.json(localData.guidance || []);
});

// GET /api/current-affairs
router.get('/current-affairs', (req, res) => {
  res.json(localData.currentAffairs || []);
});

// GET /api/book-mappings
router.get('/book-mappings', (req, res) => {
  res.json(localData.samacheerBookMappings || []);
});


// GET /api/resources (Search & Filter)
router.get('/resources', async (req, res) => {
  const { group, subject, search, type, sort } = req.query;
  let items = [];

  if (req.isMongoConnected && ResourceModel) {
    try {
      let filter = {};
      if (group && group !== 'All Groups' && group !== 'All') {
        filter.$or = [{ group: group }, { group: 'All Groups' }];
      }
      if (subject && subject !== 'All Subjects' && subject !== 'All') {
        filter.subject = subject;
      }
      if (type && type !== 'All') {
        filter.type = type;
      }
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { uploadedBy: { $regex: search, $options: 'i' } }
        ];
      }
      let sortOption = { createdAt: -1 };
      if (sort === 'popular') sortOption = { downloads: -1 };
      items = await ResourceModel.find(filter).sort(sortOption);
      if (!items || items.length === 0) {
        items = [...(localData.resources || [])];
      }
    } catch (err) {
      console.warn('MongoDB query failed, falling back to local JSON:', err.message);
      items = [...(localData.resources || [])];
    }
  } else {
    items = [...(localData.resources || [])];
  }

  // Fallback filtering in case of JSON store
  if (group && group !== 'All Groups' && group !== 'All') {
    items = items.filter(r => r.group === group || r.group === 'All Groups' || r.group === 'All');
  }
  if (subject && subject !== 'All Subjects' && subject !== 'All') {
    items = items.filter(r => r.subject === subject);
  }
  if (type && type !== 'All') {
    items = items.filter(r => r.type === type);
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(r => 
      (r.title && r.title.toLowerCase().includes(q)) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.uploadedBy && r.uploadedBy.toLowerCase().includes(q)) ||
      (r.subject && r.subject.toLowerCase().includes(q))
    );
  }

  if (sort === 'popular') {
    items.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
  } else {
    items.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }

  res.json(items);
});

// POST /api/resources (Upload Resource)
router.post('/resources', upload.single('file'), async (req, res) => {
  try {
    const { title, uploadedBy, group, subject, type, description } = req.body;
    
    if (!title || !uploadedBy || !group || !subject) {
      return res.status(400).json({ error: 'Title, Uploader name, Group, and Subject are required.' });
    }

    const fileName = req.file ? req.file.originalname : (req.body.fileName || 'study_material.pdf');
    const filePath = req.file ? `/uploads/${req.file.filename}` : '#';

    const newResource = {
      id: 'res-' + Date.now(),
      title,
      uploadedBy,
      group: group || 'Group 1',
      subject: subject || 'General Studies',
      type: type || 'Notes',
      description: description || '',
      fileName,
      filePath,
      fileSize: req.file ? `${(req.file.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB',
      downloads: 0,
      upvotes: 0,
      date: new Date().toISOString().split('T')[0]
    };

    // Save in Mongo if available
    if (req.isMongoConnected && ResourceModel) {
      try {
        const mongoRes = new ResourceModel(newResource);
        await mongoRes.save();
      } catch (err) {
        console.warn('Could not save to MongoDB, saving to local JSON:', err.message);
      }
    }

    // Always push to localData for instant response consistency
    localData.resources.unshift(newResource);
    persistLocalData();

    res.status(201).json({ message: 'Resource uploaded successfully!', resource: newResource });
  } catch (err) {
    console.error('Error uploading resource:', err);
    res.status(500).json({ error: 'Server error uploading file' });
  }
});

// POST /api/resources/:id/download
router.post('/resources/:id/download', (req, res) => {
  const item = (localData.resources || []).find(r => r.id === req.params.id);
  if (item) {
    item.downloads = (item.downloads || 0) + 1;
    persistLocalData();
    res.json({ success: true, downloads: item.downloads });
  } else {
    res.status(404).json({ error: 'Resource not found' });
  }
});

module.exports = router;

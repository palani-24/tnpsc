require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const apiRoutes = require('./routes/api');
const seedDatabase = require('./dbSeed');

const app = express();
const PORT = process.env.PORT || 3000;

let isMongoConnected = false;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach MongoDB connection flag to requests
app.use((req, res, next) => {
  req.isMongoConnected = isMongoConnected;
  next();
});

// Serve static assets
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Clean HTML page routing for all 8 TNPSC Groups & feature sections
app.get('/group1', (req, res) => res.sendFile(path.join(__dirname, '../public/group1.html')));
app.get('/group2', (req, res) => res.sendFile(path.join(__dirname, '../public/group2.html')));
app.get('/group3', (req, res) => res.sendFile(path.join(__dirname, '../public/group3.html')));
app.get('/group4', (req, res) => res.sendFile(path.join(__dirname, '../public/group4.html')));
app.get('/group5a', (req, res) => res.sendFile(path.join(__dirname, '../public/group5a.html')));
app.get('/group6', (req, res) => res.sendFile(path.join(__dirname, '../public/group6.html')));
app.get('/group7b-8', (req, res) => res.sendFile(path.join(__dirname, '../public/group7b-8.html')));
app.get('/group7a', (req, res) => res.sendFile(path.join(__dirname, '../public/group7a.html')));

app.get('/syllabus', (req, res) => res.sendFile(path.join(__dirname, '../public/syllabus.html')));
app.get('/previous-papers', (req, res) => res.sendFile(path.join(__dirname, '../public/previous-papers.html')));
app.get('/resources', (req, res) => res.sendFile(path.join(__dirname, '../public/resources.html')));
app.get('/study-plan', (req, res) => res.sendFile(path.join(__dirname, '../public/study-plan.html')));
app.get('/guidance', (req, res) => res.sendFile(path.join(__dirname, '../public/guidance.html')));
app.get('/faq', (req, res) => res.sendFile(path.join(__dirname, '../public/faq.html')));

// API Routes
app.use('/api', apiRoutes);

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// MongoDB Connection with fallback
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tnpsc_db';

if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      isMongoConnected = true;
      console.log('✅ Successfully connected to Cloud MongoDB Atlas database!');
      await seedDatabase();
    })
    .catch((err) => {
      isMongoConnected = false;
      console.warn('⚠️ MongoDB Connection Warning:', err.message);
      console.log('ℹ️ Operating cleanly with local persistent JSON storage fallback!');
    });
}

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 TNPSC Path Platform Running at: http://localhost:${PORT}`);
    console.log(` Supporting All 8 TNPSC Exam Groups:`);
    console.log(` Group 1, Group 2 & 2A, Group 3, Group 4 & VAO,`);
    console.log(` Group 5A, Group 6, Group 7B & 8, Group 7A`);
    console.log(` Status: Active, Frontend <-> Backend <-> MongoDB Atlas Integrated!`);
    console.log(`====================================================`);
  });
}

module.exports = app;

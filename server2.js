// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Initialize Express application
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to log incoming requests
app.use((req, res, next) => {
    const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
    fs.appendFile(path.join(__dirname, 'server.log'), log, (err) => {
        if (err) {
            console.error('Failed to write to log file');
        }
    });
    console.log(log.trim());
    next();
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define Student Schema and Model
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    course: String
});
const Student = mongoose.model('Student', studentSchema);

// Routes
app.get('/', (req, res) => {
    res.send('<h1>Welcome to Full Stack Development</h1>');
});

app.get('/about', (req, res) => {
    res.send('<h1>About This Application</h1><p>This is a simple Express.js application.</p>');
});

// CRUD Operations for Students

// Create Student
app.post('/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send(student);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get All Students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.send(students);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update Student
app.put('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return res.status(404).send("Student not found");
        res.send(student);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete Student
app.delete('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).send("Student not found");
        res.send({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors({

}));
app.use(bodyParser.json());

// MongoDB connection
const dbURI = 'mongodb+srv://yaswanth:yash%40123@cluster0.wdxodrc.mongodb.net/mearnapp?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('Error connecting to MongoDB Atlas', error);
});


// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/api/users', async(req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.send(newUser);
});

app.get('/api/users', async(req, res) => {
    const users = await User.find();
    res.send(users);
});
app.delete('/api/users/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.send('User deleted');
    } catch (error) {
        res.status(400).send(error.message);
    }
});
// In your Express server (e.g., server.js or routes/users.js)
app.put('/api/users/:id', async(req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
        res.send(updatedUser);
    } catch (error) {
        res.status(400).send(error.message);
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
const express = require('express'); 
const cors = require('cors'); 
const mongoose = require('mongoose'); 
require('dotenv').config(); 
const Todo = require('./models/Todo');


const app = express(); 

app.use(express.json()); 
app.use(cors()); 

const port = 4001; 

const connectionString = process.env.MONGO_URI; 

const admin = require('firebase-admin');
const serviceAccount = require('./firebaseConfig/firebase-admin.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log("Firebase Admin initlialized")

const checkAuth = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).send('Unauthorized: No token provided');
    }
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken; // Add the decoded token to the request object
      next();
    } catch (error) {
      res.status(401).send('Unauthorized: Invalid token');
    }
  };
  
mongoose.connect(connectionString)
.then(() => console.log('Connected to the database…'))
.catch((err) => console.error('Connection error:', err));


//Routes 
app.get('/todo', checkAuth, async (req, res) => { 
   const allTasks = await Todo.find({ userId: req.user.uid});
   res.json(allTasks)
 });

app.post('/todo/new', checkAuth, async (req,res) => {
    const newTask = new Todo({...req.body, userId: req.user.uid});
    await newTask.save();
    res.status(201).json({newTask})
})

app.delete('/todo/delete/:id', checkAuth, async (req, res) => {
    const result = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (result) {
      res.json(result);
    } else {
      res.status(404).send('Item not found or unauthorized');
    }
  });

app.put('/todo/update/:id', checkAuth, async (req, res) => {
    const result = await Todo.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.uid }, 
        req.body, 
        { new: true }
    );
    if (result) {
        res.json(result);
    } else {
        res.status(404).send('Item not found or unauthorized');
    }
});


app.listen(port, () => console.log(`Server is running on port ${port}`));
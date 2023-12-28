const express = require('express'); 
const cors = require('cors'); 
const mongoose = require('mongoose'); 
require('dotenv').config();
const cookieParser = require('cookie-parser')(); 
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

const validateFirebaseIdToken = async (req, res, next) => {
  //console.log('Check if request is authorized with Firebase ID token');

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !(req.cookies && req.cookies.__session)) {
    console.log(
      'No Firebase ID token was passed as a Bearer token in the Authorization header.',
      'Make sure you authorize your request by providing the following HTTP header:',
      'Authorization: Bearer <Firebase ID Token>',
      'or by passing a "__session" cookie.'
    );
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    //console.log('Found "Authorization" header');
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else if(req.cookies) {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  } else {
    // No cookie
    res.status(403).send('Unauthorized');
    return;
  }

  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    //console.log('ID Token correctly decoded', decodedIdToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch (error) {
    console.log('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
    return;
  }
};

//Checks and verifies is a logged in user
//Adds to middleware for every request to endpoints
//From github
//https://github.com/firebase/functions-samples/blob/main/Node-1st-gen/authorized-https-endpoint/functions/index.js

app.use(cookieParser);
app.use(validateFirebaseIdToken)

console.log("Firebase Admin initlialized")

// const checkAuth = async (req, res, next) => {
//     const token = req.headers.authorization;

//     if (!token) {
//       return res.status(401).send('Unauthorized: No token provided');
//     }
  
//     try {
//       const decodedToken = await admin.auth().verifyIdToken(token);
//       req.user = decodedToken; // Add the decoded token to the request object
//       next();
//     } catch (error) {
//       res.status(401).send('Unauthorized: Invalid token');
//     }
//   };
  
mongoose.connect(connectionString)
.then(() => console.log('Connected to the database…'))
.catch((err) => console.error('Connection error:', err));


//Routes 
app.get('/todo', async (req, res) => { 
   const allTasks = await Todo.find({ userId: req.user.uid});
   res.json(allTasks)
 });

app.post('/todo/new', async (req,res) => {
    const newTask = new Todo({...req.body, userId: req.user.uid});
    await newTask.save();
    res.status(201).json({newTask})
})

app.delete('/todo/delete/:id', async (req, res) => {
    const result = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (result) {
      res.json(result);
    } else {
      res.status(404).send('Item not found or unauthorized');
    }
  });

app.put('/todo/update/:id', async (req, res) => {
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
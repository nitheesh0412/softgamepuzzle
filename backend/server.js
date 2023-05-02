const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path')
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname + "/public")))
mongoose.connect("mongodb://127.0.0.1:27017/game-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("connected to db")).catch(console.error);
app.listen(3001, () => console.log("server started on port 3001"));

const User = require('./models/user');

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if the email address is already in use
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email address already in use' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user object with the hashed password and save it to the database
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  // Return a success response
  res.json({ message: 'User registered successfully' });
});

const JWT_SECRET = 'mysecret';

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Check if the email address exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  // Compare the password provided by the user with the hashed password in the database
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  // Generate a JWT token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);

  // Return the token to the client
  res.json({ token });
});


const Admin = require('./models/admin');

app.post('/adminlogin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  if (password !== admin.password) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ adminId: admin._id }, JWT_SECRET);

  res.json({ token });
});

app.put('/inspect/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { timeSpent, wrongAnswers } = req.body;

    if (timeSpent || wrongAnswers) {
      user.timeSpent.push(timeSpent);
      user.wrongAnswers.push(wrongAnswers);
    }

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.put('/slidepuzzle/:email', async (req, res) => {
  try {
    const  email  = req.params.email;
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { noofmoves, timeslide } = req.body;

    if (noofmoves || timeslide ){
      user.noofmoves.push(noofmoves);
      user.timeslide.push(timeslide);
    }
    await user.save();
    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/:email/stats', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const numTasks = user.timeSpent.length;
    const totalWrongAnswers = user.wrongAnswers.reduce((acc, val) => acc + val, 0);
    const totalSecondsSpent = user.timeSpent.reduce((acc, val) => acc + val, 0);
    const avgSecondsPerTask = totalSecondsSpent / numTasks;

    res.json({
      numTasks,
      totalWrongAnswers,
      totalSecondsSpent,
      avgSecondsPerTask,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/:email/puzzlestats', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const numoftimesplayed = user.timeslide.length;
    const totalmoves = user.noofmoves.reduce((acc, val) => acc + val, 0);
    const totalSecondsSpent = user.timeslide.reduce((acc, val) => acc + val, 0);
    const avgmoves = totalmoves / numoftimesplayed;

    res.json({
      numoftimesplayed,
      totalmoves,
      totalSecondsSpent,
      avgmoves,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/adminstats', async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).json({ message: 'No users found' });
    }

    const numUsers = users.length;

    const game1Leaderboard = users
      .map(user => ({
        email: user.email,
        wronglyanswered : user.wrongAnswers.reduce((a,b) => a+b , 0),
        totalTimeSpent: user.timeSpent.reduce((a, b) => a + b, 0)
      }))
      .sort((a, b) => {
        if (a.totalTimeSpent === 0) return 1;
        if (b.totalTimeSpent === 0) return -1;
        return a.totalTimeSpent - b.totalTimeSpent;
      })

    const game2Leaderboard = users
      .map(user => ({
        email: user.email,
        timesplayed : user.noofmoves.length,
        avgMoves: user.noofmoves.reduce((a, b) => a + b, 0) / user.noofmoves.length
      }))
      .sort((a, b) => {
        if (a.timesplayed === 0) {
          return 1;
        }
        if (b.timesplayed === 0) {
          return -1;
        }
        return a.avgMoves - b.avgMoves;
      });

    const response = {
      numUsers,
      game1Leaderboard,
      game2Leaderboard
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = app;
const express = require('express');
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array, return the maximum of the array.",
    testCases: [
      {
        input: "[1, 2, 3, 4, 5]",
        output: "5"
      }
    ]
  }
];

const SUBMISSIONS = [];

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  // Assuming you have a way to authenticate the user and check if they are an admin
  // For simplicity, let's assume there's only one admin with a specific email address
  const adminEmail = "admin@example.com";
  const isAdminUser = req.body.email === adminEmail; // Check if the user is an admin based on their email
  if (isAdminUser) {
    next(); // User is an admin, proceed to the next middleware/route handler
  } else {
    res.status(403).send("Unauthorized"); // User is not an admin, send forbidden status
  }
};

app.use(express.json()); // Middleware to parse JSON request bodies

app.post('/signup', function(req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email already exists
  const userExists = USERS.some(user => user.email === email);

  if (userExists) {
    res.status(409).send("User already exists");
  } else {
    USERS.push({ email, password });
    res.sendStatus(200);
  }
});

app.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email exists and the password is correct
  const user = USERS.find(user => user.email === email && user.password === password);

  if (user) {
    const token = generateToken(); // Generate a random token
    res.status(200).json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
});

app.get("/submissions", function(req, res) {
  res.json(SUBMISSIONS);
});

app.post("/submissions", function(req, res) {
  const submission = req.body;

  // Randomly accept or reject the solution
  submission.accepted = Math.random() < 0.5;

  SUBMISSIONS.push(submission);
  res.sendStatus(200);
});

// Admin route to add a new problem
app.post("/problems", isAdmin, function(req, res) {
  const problem = req.body;
  QUESTIONS.push(problem);
  res.sendStatus(200);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});

function generateToken() {
  // Generate a random token using any method of your choice
  return "randomToken123";
}

const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cors = require("cors");

const corsoption = {
  origin: ["http://localhost:5173"],
};
const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key"; // Replace with a strong secret key

// Middleware
// app.use(cors(corsoption));
app.use(bodyParser.json());
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: err.message || "Invalid token" });
    }
    req.user = user; // Attach decoded token payload to request
    next();
  });
}


// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "lmao", // Replace with your database name
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});

// Routes

// User Flow
// User Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM user WHERE username = ?";

  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0)
      return res.status(401).json({ message: "Invalid username or password" });

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = jwt.sign({ userid: user.userid }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token, userid: user.userid });
  });
});

// User Register
app.post("/register", async (req, res) => {
  const { username, email, password, repassword } = req.body;
  console.log(req.body)
  if (password != repassword)
    return res.status(400).json({ message: "password does not match" });

  const gsatl = await bcrypt.genSalt(10)
  const hashpass = await bcrypt.hash(password, gsatl);
  const created_unix = Date.now();
  const query =
    "INSERT INTO user (username, email, password, created_unix) VALUES (?, ?, ?, ?)";

  db.query(query, [username, email, hashpass, created_unix], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ message: "User created", userid: result.insertId });
  });
});

// User Change Password
app.put(
  "/changepassword/",
  authenticateToken,
  async (req, res) => {
    const { userid, password, repassword } = req.body;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const query = "UPDATE user SET password = ? WHERE userid = ?";
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!token)
      return res.status(401).json({ message: "Access token missing" });
    const jwtdecode = jwt.verify(token, SECRET_KEY)

    if (password != repassword)
      return res.status(400).json({ message: "password does not match" });
    if (userid != jwtdecode.userid) return res.status(403);

    db.query(query, [hashedPassword, userid], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).json({ message: "password change success" });
    });
  }
);

// User Change email
app.put(
  "/changeEmail/",
  authenticateToken,
  async (req, res) => {
    const { userid, email } = req.body;
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const query = "UPDATE user SET email = ? WHERE userid = ?";
    if (!token)
      return res.status(401).json({ message: "Access token missing" });

    const jwtdecode = jwt.verify(token, SECRET_KEY)

    if (userid != jwtdecode.userid) return res.status(403);

    db.query(query, [email, userid], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(200).json({ message: "email change success" });
    });
  }
);

// POST flow

// Get a Post from Username
app.get("/posts/:username", (req, res) => {
  const { username } = req.params; // Correctly extract the username
  const limit = 10;

  db.query(
    "SELECT userid FROM user WHERE username = ?",
    [username],
    (err, userResults) => {
      if (err) return res.status(500).send(err);
      if (userResults.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const userId = userResults[0].userid;
      db.query(
        "SELECT * FROM post WHERE userid = ? LIMIT ?",
        [userId, limit],
        (err, postResults) => {
          if (err) return res.status(500).send(err);
          res.json(postResults);
        }
      );
    }
  );
});

// Get Post
app.get("/posts", (req, res) => {
  const limit = 10;
  db.query("SELECT * FROM post LIMIT ?", [limit], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Create a Post
app.post("/posts", authenticateToken, (req, res) => {
  const { post } = req.body;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  const jwtdecode = jwt.verify(token, SECRET_KEY)
  const created_unix = Date.now(); // Automatically set current Unix timestamp
  const query = "INSERT INTO post (userid, post, created_unix) VALUES (?, ?, ?)";

  db.query(query, [jwtdecode.userid, post, created_unix], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ message: "Post created", postId: result.insertId });
  });
});

// Update a Post
app.put("/posts/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { post } = req.body;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token missing" });

  const jwtdecode = jwt.verify(token, SECRET_KEY);
  const queryuserid = "SELECT * FROM post WHERE postid = ?";
  db.query(queryuserid, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0 || result[0].userid !== jwtdecode.userid) {
      return res.status(403).json({ message: "Forbidden" });
    }
  });

  const query = "UPDATE post SET post = ? WHERE postid = ?";
  db.query(query, [post, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Post updated" });
  });
});

// Delete a Post
app.delete("/posts/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token missing" });

  const jwtdecode = jwt.verify(token, SECRET_KEY)
  const queryuserid = "SELECT * FROM post WHERE postid = ?";
  db.query(queryuserid, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0 || result[0].userid !== jwtdecode.userid) {
      return res.status(403).json({ message: "Forbidden" });
    }
  });
  db.query("DELETE FROM post WHERE postid = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Post deleted" });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

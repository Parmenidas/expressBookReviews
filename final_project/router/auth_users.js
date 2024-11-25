const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    // Check whether username is already taken
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });

    // Return if already taken ...
    if (userswithsamename.length > 0) {
        return false;
    } else{
        return true;
    }

}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // Find the book
    let book = books[req.params.isbn];
    if (book){
        // Get reviews
        let review_list = book["reviews"];
        // Add review
        review_list[req.session.authorization['username']] = req.query.review;
        // Send updated info
        res.send(review_list);
    }else{
        res.send("Unable to find book");
    }
    
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    // Find the book
    let book = books[req.params.isbn];
    if (book){
        // Get reviews
        let review_list = book["reviews"];
        // Delete review
        delete review_list[req.session.authorization['username']];
        // Send updated info
        res.send(review_list);
    }else{
        res.send("Unable to find book");
    }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

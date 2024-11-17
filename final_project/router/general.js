const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Extract the isbn parameter from the request URL
    const isbn = req.params.isbn;
    // Get the book
    let book = books[isbn];
    // Send the data in JSON format
    if (book){ // If book exists
        res.send(JSON.stringify(book,null,4));
    }else{
        res.send("Unable to find book");
    }    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Extract author
    const author = req.params.author;
    // Save all books with the same authors
    book_list = [];

    // Check the list of books
    for(var key in books) {
        var book = books[key];
        if( book["author"] === author ){
            book_list.push(book);
        }        
      }
    if (book_list.length){ // If at least one book is found
        res.send(JSON.stringify(book_list,null,4));
    }else{
        res.send("Unable to find book");
    }      
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Extract title
    const title = req.params.title;
    // Save all books with the same authors
    book_list = [];

    // Check the list of books
    for(var key in books) {
        var book = books[key];
        if( book["title"] == title ){
            book_list.push(book);
        }        
      }
    if (book_list.length){ // If at least one book is found
        res.send(JSON.stringify(book_list,null,4));
    }else{
        res.send("Unable to find book");
    }      
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Extract the isbn parameter from the request URL
    const isbn = req.params.isbn;
    // Get the book
    let book = books[isbn];
    // Send the data in JSON format
    if (book){ // If book exists
        res.send(JSON.stringify(book["reviews"],null,4));
    }else{
        res.send("Unable to find book");
    }    
});

module.exports.general = public_users;

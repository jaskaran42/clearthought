// Summon the power of express
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const {writeToFile} = require('./libft');

// API Middlewares
app.use(express.static("public")); // Display HTML + CSS
app.use(express.json({limit: '50mb'})); // Accept data in JSON format
app.use(express.urlencoded({limit: '50mb'})); // Decode data send through HTML form

// When receive GET request home page, send this
app.get('/', function(req,res){
    // Send HTTP responsWorlde to browser
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// When receive POST request
app.post('/', (req, res) =>{
    // Store raw form data
    let raw_content = req.body.trace;
    // Clean up
    raw_content = raw_content.substring(raw_content.indexOf("= ex00")).split('\n');

    // Add basic HTML
    let htmlStruct = fs.readFileSync('./public/html_struct.txt', 'utf8');
    htmlStruct = htmlStruct.split('\n') // Turn into array
    // Reset output.html
    writeToFile("", "w")
    // Convert text to HTML & write to output.html
    for (j = 0; j < htmlStruct.length;j++)
    {
        if (/^<start_here>/.test(htmlStruct[j])){
            // Style the content
            for (i = 0; i < raw_content.length; i++)
            {
                // Error handling: retour a la ligne
                raw_content[i] = raw_content[i].replace(/\r/, ''); // Enlever retour a la ligne
                // Gerer les titres
              if (/^= ex/.test(raw_content[i])){
                  raw_content[i] = raw_content[i].replace(/= ex/, '<h1> ex').replace(/=+/, '</h1>');
                  writeToFile(raw_content[i], "a");
              }
              // Gerer les sous-titres
              else if (/^= Test/.test(raw_content[i])){
                  raw_content[i] = raw_content[i].replace(/= Test/, '<h3> Test').replace(/=+/, '</h3>');
                  writeToFile(raw_content[i], "a");
              }
              // Gerer les scripts Shell
              else if (/^\$>/.test(raw_content[i])){
                  raw_content[i] = raw_content[i].replace(/^\$>/, '<p><span>$></span>')
                  writeToFile(`${raw_content[i]}</p>`, "a");
              }
              // Gerer le reste
              else {
                  if (raw_content[i]) {
                      writeToFile(`<p>${raw_content[i]}</p>`, "a");
                  }
              }
            }

        }
        writeToFile(htmlStruct[j], "a");
    }
    // Send HTML to front-end
    res.sendFile(path.join(__dirname, "./public/output.html"))
})

app.listen(2000);
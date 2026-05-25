const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 4000;
const api = require('./routes/recipeAPI.js');

// define route handlers:
app.use('/parse', api)

app.get("/", (req, res) => {
    res.send("Recipe API is running");
});

// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.sendStatus(404));

// global catch-all error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    // define Default error object
    const defaultErr = {
        log: 'Express error handler caught unknown middleware error',
        status: 400,
        message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    res.status(errorObj.status).send(errorObj.message);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app
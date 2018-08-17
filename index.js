const express = require('express');
const app = express();

app.use(express.static('public'));

app.listen(3000, () => {
    console.log('Application listening on port 3000');
    require("openurl").open("http://localhost:3000/");
});


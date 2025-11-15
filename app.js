var express = require('express');
var app = express();
app.use(express.json());
var port = 3000;
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.post('/send-details', function (req, res) {
    if (!req.body)
        return res.status(400).send('Bad Request1');
    var _a = req.body, accountNumber = _a.accountNumber, name = _a.name;
    if (!accountNumber || !name) {
        console.log('Missing accountNumber or name in request body');
        return res.status(400).send('Bad Request2');
    }
    res.send("".concat(name, "'s accountNumber is ").concat(accountNumber));
});
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
const app = express();
const __dirname = import.meta.dirname;
const urlEncoderParser = bodyParser.urlencoded({extended: false});
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/pages/home.htm")
})

app.get('/userPage', (req, res) => {
    res.sendFile(__dirname + "/pages/user.htm")
})
app.get('/getUser', (req, res) => {
    const response = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
    }
    console.log("Response is ", response)
    res.end(`Received data: ${JSON.stringify(response)}`)
})

app.get('/studentForm', (req, res) => {
    res.sendFile(__dirname + "/pages/student.htm")
})
app.get('/getStudent', (req, res) => {
    const response = {
        studentID: req.query.studentID,
        section: req.query.section,
        firstName: req.query.firstName,
        lastName: req.query.lastName,
    }
    console.log("Response is ", response)
    res.end(`Received data: ${JSON.stringify(response)}`)
})

app.get('/adminForm', (req, res) => {
    res.sendFile(__dirname + "/pages/admin.htm")
})
app.post('/postAdmin', urlEncoderParser, (req, res) => {
    const response = {
        adminID: req.body.adminID,
        department: req.body.department,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    }
    console.log("Response is ", response)
    res.end(`Posted data: ${JSON.stringify(response)}`)
})

app.get('/user', (req, res) => {
    const userId = req.query.id;
    const userName = req.query.name;
    if (userId && userName) {
        res.send(`<html><body><h1>${userName}'s ID is: ${userId}</h1></body></html>`);
    } else {
        res.status(400).send('User ID and name are required');
    }
})

const server = app.listen(5000, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server running at http://${host}:${port}`);
})
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const urlEncoderParser = bodyParser.urlencoded({ extended: false });

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, 'uploads/'));
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).fields([{name: 'file', maxCount: 1}]);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/home.htm"));
});

app.get('/userPage', (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/user.htm"));
});

app.get('/getUser', (req, res) => {
    const response = {
        firstName: req.query.firstName,
        lastName: req.query.lastName,
    };
    console.log("Response is", response);
    res.end(`Received data: ${JSON.stringify(response)}`);
});

app.get('/studentForm', (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/student.htm"));
});

app.get('/getStudent', (req, res) => {
    const response = {
        studentID: req.query.studentID,
        section: req.query.section,
        firstName: req.query.firstName,
        lastName: req.query.lastName,
    };
    console.log("Response is", response);
    res.end(`Received data: ${JSON.stringify(response)}`);
});

app.get('/adminForm', (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/admin.htm"));
});

app.post('/postAdmin', urlEncoderParser, (req, res) => {
    const response = {
        adminID: req.body.adminID,
        department: req.body.department,
        firstName: req.body.firstName,
        lastName: req.body.lastName, }
    console.log("Response is", response);
    res.end(`Posted data: ${JSON.stringify(response)}`);
});

app.post('/uploadAdmin', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).send('Unexpected file field. Please ensure the file field is named "file".');
            }
            return res.status(400).send(`Error uploading file: ${err.message}`);
        }
        const response = {
            adminID: req.body.adminID,
            department: req.body.department,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        };
        const upFiles = req.files['file'];
        if (!upFiles || upFiles.length === 0) {
            return res.status(400).send('No file uploaded. Please ensure the file field is correct.');
        }
        const file = upFiles[0];
        console.log("Response data:", response);
        console.log(`File path: ${file.path}`);
        console.log(`File name: ${file.originalname}`);
        res.end(`Posted data: ${JSON.stringify(response)} and file: ${file.originalname}`);
    });
});


app.get('/user', (req, res) => {
    const userId = req.query.id;
    const userName = req.query.name;
    if (userId && userName) {
        res.send(`<html><body><h1>${userName}'s ID is: ${userId}</h1></body></html>`);
    } else {
        res.status(400).send('User ID and name are required');
    }
});

const server = app.listen(5000, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Server running at http://localhost:${port}`);
});

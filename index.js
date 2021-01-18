// Import packages
const express    = require('express'); // App framework https://expressjs.com/
const bodyParser = require('body-parser');      
const nodemailer = require('nodemailer');

// Allows app to parse json
const app        = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set port
const port = process.env.PORT || 8080;

// Below are routes for api
const router = express.Router(); 

// Test route to see if working (accessed at GET http://localhost:8080/api/test)
router.get('/test', function(req, res) {
    res.json({ message: 'api is working' });
});

// Post route for email
router.post('/email', function(req, res) {
    console.log(req.body);
    if (!req.body.email) {
        res.status(500).send({ error: 'email required!' })
    }
    if (!req.body.message) {
        res.status(500).send({ error: 'message required!' })
    }

    try {
        // Email service
        const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                user: 'funkymonkeyblogemail@gmail.com',
                pass: 'fmonkey123!'
            }
        });
        
        // Send email here
        const mailOptions = {
            from: 'funkymonkeyblogemail@gmail.com',
            to: req.body.email, // Your email goes here
            subject: 'Sending Email using Node.js',
            html: `<p>${req.body.email} sent you a message:</p><br>${req.body.message}`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
                res.json({ message: 'success' });
            }
        });
    } catch (err) {
        throw new Error(err.message)
    }
});

// Register routes with /api in front
app.use('/api', router);

app.listen(port);
console.log('App started on ' + port);

const config = require('./config')
const express = require('express');
const mongoose = require('./src/db/mongoose')
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

const server = require('http').createServer(app);

app.use(cors());
app.use(helmet());
app.use(compression());

app.use(require('morgan')(config.ENV));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// import all routes
require('./src/routes')(app);

app.use(function (req, res, next) {
    res.status(404).send({ error: true, message: "Sorry can't find that route!" })
})

app.use(function (err, req, res, next) {
    // res.status(500).send({ error: true, message: 'Something broke! Try again later.' })
    if (err && err.error && err.error.isJoi) {
        // we had a joi error, let's return a custom 400 json response
        res.status(400).send({
          error: true, // will be "query" here, but could be "headers", "body", or "params"
          message: err.error.toString()
        });
      } else {
        // pass on to another error handler
        // next(err);
        console.log(err)
        res.status(500).send({ error: true, message: 'Something broke! Try again later.' })
      }
})

const startServer = (server) => {
    try {
        server.listen(config.SERVER_PORT, '0.0.0.0', function () {
            console.log('   [server] listening on http://localhost:' + config.SERVER_PORT);
        });
    } catch (error) {
        console.log('   [server][error] ' + error)
    }
}
mongoose.connect()
    .then(x => startServer(server))
    .catch(err => console.log(`   [error] ${err}`))



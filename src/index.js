require("dotenv").config();

const express = require('express');
const app = express();
const routes = require('./routes');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const knex = require('./config/database');
const model = require('./model');

const path = require('path');
const rfs = require('rotating-file-stream');
const fileupload = require('express-fileupload');

const timexe = require( 'timexe' );
const signale = require('signale');

/* const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json') */

async function start() {

    app.use(bodyParser.urlencoded({limit:'50mb', extended: false }));
    app.use(bodyParser.json({limit: 10 * 1024 * 1024}));
    app.use(bodyParser.raw({limit: 10 * 1024 * 1024}));
    app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
    app.use(helmet());
    app.use(express.json());
    
    //upload de arquivos
    app.use(fileupload({
        useTempFiles : true,
        tempFileDir : '/tmp/',
        limits: { fileSize: 50 * 1024 * 1024 },
    }));

    //SAVE LOGGING TO FILE
    //var accessLogStream = rfs.createStream("access.log", {size: "10M", interval: "1d", compress: "gzip", path: path.join(__dirname, '../log')});
    morgan.token('token', function getId (req) {return req.headers['access-token'];});
    app.use(morgan(':remote-addr - - [:date[clf]] ":method :url HTTP/:http-version" Status=:status Size=:res[content-length] Referrer=":referrer" User-Agent":user-agent" Response-Time=:response-time Token=":token"', {skip: function(req, res){return res.statusCode < 400 }}));
    //app.use(morgan(':remote-addr - - [:date[clf]] ":method :url HTTP/:http-version" Status=:status Size=:res[content-length] Referrer=":referrer" User-Agent":user-agent" Response-Time=:response-time Token=":token"', {stream: accessLogStream}));


    //MODEL INIT
    await model.initModels();


    //ROUTERS
    const APP_VERSION = process.env.APP_VERSION;
    app.use(`/api/${APP_VERSION}`, routes);


   /*  //HOME PAGE
    app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerFile)) */
   

    //SERVER LISTEN
    const PORT = process.env.PORT || 3333;
    app.listen(PORT, () => {
        signale.success(`Server Running on Port ${PORT}`);
    });


    //REMOVE INVALID TOKENS
    timexe ("* * w1-7 / 6" ,  function ( ) {  
        const validade = new Date(Date.now() - (1000* 60 * 20)); //Deletar todos os tokens que tiverem mais de 20 minutos que foram inseridos
        knex('tokens').where('created_at', '<', validade).del();
        // * * * 0-23 / 1                   //A CADA 1 minuto
        //* * w1-7 / 6                      //A CADA 6 horas
    });

}

start();

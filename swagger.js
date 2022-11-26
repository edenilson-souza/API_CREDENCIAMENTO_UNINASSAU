require("dotenv").config();
const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes.js']

const doc = {
    info: {
        version: "1.0.0",
        title: "API V3L0Z",
        description: "Documentation automatically generated by the <b>swagger-autogen</b> module."
    },
    host: process.env.NODE_ENV == 'production' ? "http://44.212.224.138:3333" : "localhost:3333",
    basePath: "/api/v1",
    schemes: ['https', 'http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        {
            "name": "V3L0Z Backend",
            "description": "Endpoints"
        }
    ],
    securityDefinitions: {
        api_key: {
            type: "apiKey",
            name: "access-token",
            in: "header"
        }
    }
    /*securityDefinitions: {
        api_key: {
            type: "apiKey",
            name: "api_key",
            in: "header"
        },
        petstore_auth: {
            type: "oauth2",
            authorizationUrl: "https://petstore.swagger.io/oauth/authorize",
            flow: "implicit",
            scopes: {
                read_pets: "read your pets",
                write_pets: "modify pets in your account"
            }
        }
    },
    definitions: {
        User: {
            name: "Jhon Doe",
            age: 29,
            parents: {
                father: "Simon Doe",
                mother: "Marie Doe"
            },
            diplomas: [
                {
                    school: "XYZ University",
                    year: 2020,
                    completed: true,
                    internship: {
                        hours: 290,
                        location: "XYZ Company"
                    }
                }
            ]
        },
        AddUser: {
            $name: "Jhon Doe",
            $age: 29,
            about: ""
        }
    }*/
}


swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./src/index.js')
})
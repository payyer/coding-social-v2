const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Coding Social',
            version: '1.0.0',
            description: 'API documentation for Coding Social application',
        },
    },
    apis: ['./src/routes/**/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
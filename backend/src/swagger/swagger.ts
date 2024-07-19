// src/swagger.ts
import swaggerJSDoc, { Options }  from 'swagger-jsdoc';


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Chat API(Socket.io)',
    version: '1.0.0',
    description: 'This is a Chat Application API made with Express and documented with Swagger',
  },
  servers: [
    {
      url: 'http://localhost:8001',
      description: 'Development server',
    },
  ],
};

const options:Options = {
  swaggerDefinition,
  apis: ['./src/routes/*.routes.ts']
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

// src/swagger/swagger.ts
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Load the YAML file
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yml'));

export default swaggerDocument;

import { Server } from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import Env from '../common/config/build_env.js';

export const registerSwagger = async (server: Server): Promise<void> => {
  const swaggerOptions: HapiSwagger.RegisterOptions = {
    info: {
      title: 'Resume Project API',
      version: '1.0.0',
      description: 'API documentation for Resume Management System',
      contact: {
        name: 'API Support',
        email: 'support@resumeproject.com',
      },
    },
    schemes: ['http', 'https'],
    host: Env.isDevelopment() ? `localhost:${Env.PORT}` : undefined,
    basePath: Env.getApiBasePath(),
    documentationPath: '/documentation',
    swaggerUI: true,
    swaggerUIPath: '/swaggerui/',
    jsonPath: '/swagger.json',
    templates: './node_modules/hapi-swagger/templates',
    pathPrefixSize: 2,
    payloadType: 'json',
    grouping: 'tags',
    securityDefinitions: {
      jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
      cookie: {
        type: 'apiKey',
        name: 'accessToken',
        in: 'cookie',
      },
    },
    security: [{ jwt: [] }],
    expanded: 'none',
    uiCompleteScript: `
      const logo = document.querySelector('.topbar-wrapper img');
      if (logo) {
        logo.alt = 'Resume Project API';
        logo.style.height = '40px';
      }
    `,
  };

  try {
    // Register required plugins for Swagger
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions,
      },
    ]);

    console.log('✅ Swagger documentation plugin registered successfully');
  } catch (error) {
    console.error('❌ Failed to register Swagger plugin:', error);
    throw error;
  }
};

// Export plugin registration helper
export const swaggerPlugin = {
  name: 'swagger-documentation',
  version: '1.0.0',
  register: registerSwagger,
};

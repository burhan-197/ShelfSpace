const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'ShelfSpace API',
    version: '1.0.0',
    description:
      'Versioned REST API for ShelfSpace, a personal book library. ' +
      'All success responses use the envelope { success: true, data, meta? }; ' +
      'errors use { success: false, error: { code, message } }.'
  },
  servers: [{ url: 'http://localhost:8000', description: 'Local development' }],
  tags: [
    { name: 'Books', description: 'Book CRUD, upload, download and metadata' },
    { name: 'System', description: 'Service health' }
  ],
  components: {
    schemas: {
      Book: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '64f1a2b3c4d5e6f708192a3b' },
          title: { type: 'string', example: 'Pride and Prejudice' },
          author: { type: 'string', example: 'Jane Austen' },
          pages: { type: 'integer', example: 432 },
          publishDate: { type: 'string', format: 'date-time', example: '1813-01-28T00:00:00.000Z' },
          genre: { type: 'string', example: 'fiction' },
          filePath: { type: 'string', example: 'uploads/1813-pride-and-prejudice.pdf' },
          coverImage: { type: 'string', example: '' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      SuccessEnvelope: {
        type: 'object',
        required: ['success'],
        properties: {
          success: { type: 'boolean', example: true }
        }
      },
      ErrorEnvelope: {
        type: 'object',
        required: ['success', 'error'],
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'NOT_FOUND' },
              message: { type: 'string', example: 'Book not found' }
            }
          }
        }
      },
      PaginatedBooks: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/Book' }
          },
          meta: {
            type: 'object',
            properties: {
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 10 },
              totalPages: { type: 'integer', example: 3 },
              total: { type: 'integer', example: 25 }
            }
          }
        }
      }
    },
    responses: {
      BadRequest: {
        description: 'Invalid input.',
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } }
        }
      },
      NotFound: {
        description: 'Resource not found.',
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } }
        }
      },
      ServiceUnavailable: {
        description: 'Database is not connected.',
        content: {
          'application/json': { schema: { $ref: '#/components/schemas/ErrorEnvelope' } }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  // JSDoc annotations on the v1 API routers are turned into paths.
  apis: ['./routes/api/v1/*.router.js']
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUiOptions = {
  customSiteTitle: 'ShelfSpace API'
};

// swagger-ui-express serves its UI assets from node_modules — no CDN reliance.
const swaggerDocsRouter = express.Router();
swaggerDocsRouter.get('/openapi.json', (req, res) => res.json(swaggerSpec));
swaggerDocsRouter.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

module.exports = { swaggerSpec, swaggerDocsRouter };

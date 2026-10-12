const express = require('express');
const { booksRouter } = require('./books.router');

const apiRouter = express.Router();

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     summary: Service health
 *     description: Liveness check. Does not require a database connection.
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Service is up.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: 'ok' }
 *                 uptime: { type: number, description: 'Process uptime in seconds' }
 *                 version: { type: string, example: '1.0.0' }
 */
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    version: require('../../../package.json').version
  });
});

apiRouter.use('/books', booksRouter);

module.exports = { apiRouter };

require('dotenv').config()

const Koa = require('koa');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

router
  .get('/', (ctx) => {
    ctx.body = 'Hello!';
  })
  .post('/', async (ctx, next) => {
    const { uri } = ctx.request.body;

    // Validate the URI
    if (!uri) {
      ctx.status = 400;
      ctx.body = { error: 'URI is required' };
      return;
    }

    // Validate URI starts with https://vertexaisearch.cloud.google.com
    if (!uri.startsWith('https://vertexaisearch.cloud.google.com')) {
      ctx.status = 400;
      ctx.body = { error: 'Invalid URI' };
      return;
    }

    // Process the URI
    try {
      // Use HEAD request to be more efficient as we don't need the body
      const res = await fetch(uri, { method: 'HEAD', redirect: 'follow' });
      ctx.body = { url: res.url };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to process URI' };
    }
  })

app
  .use(cors())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
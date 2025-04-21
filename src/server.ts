import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import cors from '@fastify/cors';
import { userRoutes } from './routes/users';

const app = Fastify();

await app.register(swagger, {
  openapi: {
    info: {
      title: 'API Website Rede Community',
      description: 'Documentação da API',
      version: '1.0.0',
    },
  },
});

await app.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
});

await app.register(cors, {
  origin: true,
});

await app.register(userRoutes, { prefix: '/api' });

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running at ${address}`);
});

import { prisma } from '../lib/prisma';
import { FastifyInstance } from 'fastify';
import {
  createUserSchema,
  permissionsPropertiesValues,
  queryParamsSchema,
  roleEnumValues,
  updateUserSchema,
} from '../schemas/userSchema';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';

export async function userRoutes(app: FastifyInstance) {
  //Get all users
  app.get(
    '/users',
    {
      schema: {
        description: 'Retorna todos os usuários',
        tags: ['Usuários'],
        querystring: {
          type: 'object',
          required: ['limit', 'page'],
          properties: {
            limit: { type: 'integer', minimum: 1, default: 10 },
            page: { type: 'integer', minimum: 1, default: 1 },
          },
        },
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                surname: { type: 'string' },
                nameWithSurname: { type: 'string' },
                discord: { type: 'string' },
                ign: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                avatarUrl: { type: 'string' },
                role: {
                  type: 'string',
                  enum: roleEnumValues,
                },
                permissions: {
                  type: 'object',
                  properties: permissionsPropertiesValues,
                },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const result = queryParamsSchema.safeParse(request.query);

      if (!result.success) {
        return reply.status(400).send(result.error.flatten());
      }

      const { limit, page } = result.data;

      const users = await prisma.users.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });

      return users;
    }
  );

  //Get user by ID, IGN or email
  app.get(
    '/users/:id',
    {
      schema: {
        description: 'Retorna um usuário pelo ID',
        tags: ['Usuários'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              surname: { type: 'string' },
              nameWithSurname: { type: 'string' },
              discord: { type: 'string' },
              ign: { type: 'string' },
              email: { type: 'string' },
              password: { type: 'string' },
              avatarUrl: { type: 'string' },
              role: {
                type: 'string',
                enum: roleEnumValues,
              },
              permissions: {
                type: 'object',
                properties: permissionsPropertiesValues,
              },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      if (!ObjectId.isValid(id)) {
        return reply.status(400).send({ error: 'ID inválido' });
      }

      try {
        const user = await prisma.users.findUnique({
          where: { id },
        });

        if (!user) {
          return reply.status(404).send({ error: 'Usuário não encontrado' });
        }

        return user;
      } catch (error) {
        console.error(error);
        return reply.status(500).send({ error: 'Erro interno do servidor' });
      }
    }
  );

  app.get(
    '/users/ign/:ign',
    {
      schema: {
        description: 'Retorna um usuário pelo IGN',
        tags: ['Usuários'],
        params: {
          type: 'object',
          properties: {
            ign: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              surname: { type: 'string' },
              nameWithSurname: { type: 'string' },
              discord: { type: 'string' },
              ign: { type: 'string' },
              email: { type: 'string' },
              password: { type: 'string' },
              avatarUrl: { type: 'string' },
              role: {
                type: 'string',
                enum: roleEnumValues,
              },
              permissions: {
                type: 'object',
                properties: permissionsPropertiesValues,
              },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { ign } = request.params as { ign: string };

      const user = await prisma.users.findFirst({
        where: {
          ign: {
            equals: ign,
            mode: 'insensitive',
          },
        },
      });

      if (!user) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }

      return user;
    }
  );

  app.get(
    '/users/email/:email',
    {
      schema: {
        description: 'Retorna um usuário pelo email',
        tags: ['Usuários'],
        params: {
          type: 'object',
          properties: {
            email: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              surname: { type: 'string' },
              nameWithSurname: { type: 'string' },
              discord: { type: 'string' },
              ign: { type: 'string' },
              email: { type: 'string' },
              password: { type: 'string' },
              avatarUrl: { type: 'string' },
              role: {
                type: 'string',
                enum: roleEnumValues,
              },
              permissions: {
                type: 'object',
                properties: permissionsPropertiesValues,
              },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { email } = request.params as { email: string };

      const user = await prisma.users.findFirst({
        where: {
          email: {
            equals: email,
            mode: 'insensitive',
          },
        },
      });

      if (!user) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }

      return user;
    }
  );

  //Create user
  app.post(
    '/users',
    {
      schema: {
        body: zodToJsonSchema(createUserSchema, { name: 'CreateUserSchema' }),
        response: {
          201: zodToJsonSchema(
            createUserSchema.extend({
              id: z.string(),
              createdAt: z.string().datetime(),
              updatedAt: z.string().datetime(),
            }),
            { name: 'UserResponse' }
          ),
        },
      },
    },
    async (request, reply) => {
      const result = createUserSchema.safeParse(request.body);

      if (!result.success) {
        return reply.status(400).send({ error: result.error.flatten() });
      }

      const {
        name,
        surname,
        discord,
        ign,
        email,
        password,
        avatarUrl,
        role,
        permissions,
      } = result.data;

      const existingUser = await prisma.users.findFirst({
        where: {
          OR: [{ email }, { discord }, { ign }],
        },
      });

      if (existingUser) {
        return reply.status(409).send({ error: 'Usuario ja cadastrado' });
      }

      async function hashPassword(plainPassword: string) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(plainPassword, saltRounds);
        return hash;
      }

      function getAvatarUrlByIgn(ign: string): string {
        return `https://mc-heads.net/avatar/${ign}/400`;
      }

      const user = await prisma.users.create({
        data: {
          name,
          surname,
          nameWithSurname: `${name} ${surname}`,
          discord,
          ign,
          email,
          password: await hashPassword(password),
          avatarUrl: avatarUrl || getAvatarUrlByIgn(ign),
          role,
          permissions,
        },
      });

      return reply.status(201).send(user);
    }
  );

  //Update user
  app.put(
    '/users/:id',
    {
      schema: {
        description: 'Atualiza um usuário pelo ID',
        tags: ['Usuários'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
        body: zodToJsonSchema(updateUserSchema, { name: 'UpdateUserSchema' }),
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const result = updateUserSchema.safeParse(request.body);

      if (!result.success) {
        return reply.status(400).send({ error: result.error.flatten() });
      }

      const {
        name,
        surname,
        discord,
        ign,
        email,
        password,
        avatarUrl,
        role,
        permissions,
      } = result.data;

      if (!ObjectId.isValid(id)) {
        return reply.status(400).send({ error: 'ID inválido' });
      }

      const existingUser = await prisma.users.findUnique({
        where: { id },
      });

      if (!existingUser) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }

      const updatedUser = await prisma.users.update({
        where: { id },
        data: {
          name,
          surname,
          nameWithSurname: `${name} ${surname}`,
          discord,
          ign,
          email,
          password: password
            ? await bcrypt.hash(password, 10)
            : existingUser.password,
          avatarUrl: avatarUrl || existingUser.avatarUrl,
          role,
          permissions: {
            ...(typeof existingUser.permissions === 'object' &&
            existingUser.permissions
              ? existingUser.permissions
              : {}),
            ...permissions,
          },
        },
      });

      return reply.status(200).send(updatedUser);
    }
  );

  //Delete user
  app.delete(
    '/users/:id',
    {
      schema: {
        description: 'Deleta um usuário pelo ID',
        tags: ['Usuários'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      if (!ObjectId.isValid(id)) {
        return reply.status(400).send({ error: 'ID inválido' });
      }

      const user = await prisma.users.findUnique({
        where: { id },
      });

      if (!user) {
        return reply.status(404).send({ error: 'Usuário não encontrado' });
      }

      await prisma.users.delete({
        where: { id },
      });

      return reply.status(204).send();
    }
  );
}

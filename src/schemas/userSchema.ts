import { z } from 'zod';

export const roleEnumValues = [
  'member',
  'vip-hero',
  'vip-legend',
  'vip-supreme',
  'partner',
  'helper',
  'moderator',
  'moderator+',
  'manager',
  'manager+',
  'master',
] as const;

export const roleSchema = z.enum(roleEnumValues);

const permissionsSchema = z.object({
  canCreatePost: z.boolean(),
  canDeletePost: z.boolean(),
  canEditPost: z.boolean(),

  canFixPost: z.boolean(),
  canDeleteAllPost: z.boolean(),
  canEditAllPost: z.boolean(),

  canCreateComment: z.boolean(),
  canDeleteComment: z.boolean(),
  canEditComment: z.boolean(),

  canDeleteAllComment: z.boolean(),
  canEditAllComment: z.boolean(),

  canDeleteUser: z.boolean(),
  canEditUser: z.boolean(),
});

export const permissionsPropertiesValues = permissionsSchema.shape;

export const createUserSchema = z.object({
  name: z.string(),
  surname: z.string(),
  discord: z.string().min(3).optional(),
  ign: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  avatarUrl: z.string().url().optional(),
  role: roleSchema.default('member'),
  permissions: permissionsSchema.default({
    canCreatePost: true,
    canDeletePost: true,
    canEditPost: true,

    canFixPost: false,
    canDeleteAllPost: false,
    canEditAllPost: false,

    canCreateComment: true,
    canDeleteComment: true,
    canEditComment: true,

    canDeleteAllComment: false,
    canEditAllComment: false,

    canDeleteUser: false,
    canEditUser: false,
  }),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  surname: z.string().optional(),
  discord: z.string().optional(),
  ign: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  avatarUrl: z.string().url().optional(),
  role: roleSchema.optional(),
  permissions: permissionsSchema.partial().optional(),
});

export const queryParamsSchema = z.object({
  limit: z.number().default(10),
  page: z.number().default(1),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

import { Role } from '../generated/prisma/index.js';

const allRoles = {
    [Role.USER]: ['getTodos', 'manageTodos'],
    [Role.ADMIN]: ['getUsers', 'manageUsers', 'getTodos', 'manageTodos']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));

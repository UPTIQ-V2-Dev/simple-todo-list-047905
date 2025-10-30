import prisma from "../client.js";
import ApiError from "../utils/ApiError.js";
import httpStatus from 'http-status';
/**
 * Create a todo
 * @param {string} title
 * @param {number} userId
 * @returns {Promise<Todo>}
 */
const createTodo = async (title, userId) => {
    return await prisma.todo.create({
        data: {
            title,
            userId
        }
    });
};
/**
 * Get all todos for a user
 * @param {number} userId
 * @returns {Promise<{todos: Todo[], total: number}>}
 */
const getTodosByUserId = async (userId) => {
    const todos = await prisma.todo.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
    return { todos, total: todos.length };
};
/**
 * Get todo by id for a specific user
 * @param {string} id
 * @param {number} userId
 * @returns {Promise<Todo | null>}
 */
const getTodoByIdAndUserId = async (id, userId) => {
    return await prisma.todo.findFirst({
        where: { id, userId }
    });
};
/**
 * Update todo by id for a specific user
 * @param {string} id
 * @param {number} userId
 * @param {Prisma.TodoUpdateInput} updateData
 * @returns {Promise<Todo>}
 */
const updateTodoByIdAndUserId = async (id, userId, updateData) => {
    const todo = await getTodoByIdAndUserId(id, userId);
    if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Todo not found');
    }
    return prisma.todo.update({
        where: { id },
        data: updateData
    });
};
/**
 * Delete todo by id for a specific user
 * @param {string} id
 * @param {number} userId
 * @returns {Promise<Todo>}
 */
const deleteTodoByIdAndUserId = async (id, userId) => {
    const todo = await getTodoByIdAndUserId(id, userId);
    if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Todo not found');
    }
    return prisma.todo.delete({ where: { id } });
};
export default {
    createTodo,
    getTodosByUserId,
    getTodoByIdAndUserId,
    updateTodoByIdAndUserId,
    deleteTodoByIdAndUserId
};

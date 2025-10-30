import { todoService } from '../services/index.ts';
import ApiError from '../utils/ApiError.ts';
import catchAsyncWithAuth from '../utils/catchAsyncWithAuth.ts';
import pick from '../utils/pick.ts';
import httpStatus from 'http-status';

const createTodo = catchAsyncWithAuth(async (req, res) => {
    const { title } = req.body;
    const userId = req.user.id;
    const todo = await todoService.createTodo(title, userId);
    res.status(httpStatus.CREATED).send(todo);
});

const getTodos = catchAsyncWithAuth(async (req, res) => {
    const userId = req.user.id;
    const result = await todoService.getTodosByUserId(userId);
    res.send(result);
});

const getTodo = catchAsyncWithAuth(async (req, res) => {
    const todoId = req.params.id;
    const userId = req.user.id;
    const todo = await todoService.getTodoByIdAndUserId(todoId, userId);
    if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Todo not found');
    }
    res.send(todo);
});

const updateTodo = catchAsyncWithAuth(async (req, res) => {
    const todoId = req.params.id;
    const userId = req.user.id;
    const updateData = pick(req.body, ['title', 'completed']);
    const todo = await todoService.updateTodoByIdAndUserId(todoId, userId, updateData);
    res.send(todo);
});

const deleteTodo = catchAsyncWithAuth(async (req, res) => {
    const todoId = req.params.id;
    const userId = req.user.id;
    await todoService.deleteTodoByIdAndUserId(todoId, userId);
    res.status(httpStatus.NO_CONTENT).send();
});

export default {
    createTodo,
    getTodos,
    getTodo,
    updateTodo,
    deleteTodo
};

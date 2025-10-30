import Joi from 'joi';

const createTodo = {
    body: Joi.object().keys({
        title: Joi.string().required()
    })
};

const getTodos = {
    query: Joi.object().keys({})
};

const getTodo = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
};

const updateTodo = {
    params: Joi.object().keys({
        id: Joi.string().required()
    }),
    body: Joi.object()
        .keys({
            title: Joi.string(),
            completed: Joi.boolean()
        })
        .min(1)
};

const deleteTodo = {
    params: Joi.object().keys({
        id: Joi.string().required()
    })
};

export default {
    createTodo,
    getTodos,
    getTodo,
    updateTodo,
    deleteTodo
};

export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}

export type CreateTodoInput = {
    title: string;
};

export type UpdateTodoInput = Partial<{
    title: string;
    completed: boolean;
}>;

export type TodoFormData = {
    title: string;
};

export type TodosResponse = {
    todos: Todo[];
    total: number;
};

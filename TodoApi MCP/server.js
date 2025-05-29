"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const zod_1 = require("zod");
const todoapi_js_1 = require("./todoapi.js");
exports.server = new mcp_js_1.McpServer({
    name: "todoapi",
    version: "0.0.1"
});
const todoApi = new todoapi_js_1.TodoApi(process.env.TODO_API_URL || 'https://localhost:7027');
// Tool: Crear un ítem en una lista específica
exports.server.tool("todoitem_create", "Crear un ítem en una lista específica.", {
    todoListId: zod_1.z.number(),
    description: zod_1.z.string(),
}, async ({ todoListId, description }) => {
    const item = await todoApi.createTodoItem(todoListId, description);
    return { content: [{ type: "text", text: `Ítem creado: ${item.description}` }] };
});
// Tool: Actualizar un ítem existente
exports.server.tool("todoitem_update", "Actualizar la descripción de un ítem.", {
    todoListId: zod_1.z.number(),
    id: zod_1.z.number(),
    description: zod_1.z.string(),
}, async ({ todoListId, id, description }) => {
    await todoApi.updateTodoItem(todoListId, id, description);
    return { content: [{ type: "text", text: `Ítem actualizado.` }] };
});
// Tool: Completar un ítem
exports.server.tool("todoitem_complete", "Completar (marcar como finalizado) un ítem.", {
    todoListId: zod_1.z.number(),
    id: zod_1.z.number(),
}, async ({ todoListId, id }) => {
    await todoApi.completeTodoItem(todoListId, id);
    return { content: [{ type: "text", text: `Ítem completado.` }] };
});
// Tool: Eliminar un ítem
exports.server.tool("todoitem_delete", "Eliminar un ítem de una lista.", {
    todoListId: zod_1.z.number(),
    id: zod_1.z.number(),
}, async ({ todoListId, id }) => {
    await todoApi.deleteTodoItem(todoListId, id);
    return { content: [{ type: "text", text: `Ítem eliminado.` }] };
});
// Tool: Listar listas
exports.server.tool("todolist_list", "Listar todas las listas de tareas.", {}, async () => {
    const lists = await todoApi.ListTodoLists();
    return { content: [{ type: "text", text: JSON.stringify(lists) }] };
});
// Tool: Crear lista
exports.server.tool("todolist_create", "Crear una nueva lista de tareas.", {
    name: zod_1.z.string(),
}, async ({ name }) => {
    const list = await todoApi.CreateTodoList(name);
    return { content: [{ type: "text", text: `Lista creada: ${list.name}` }] };
});
// Tool: Eliminar lista
exports.server.tool("todolist_delete", "Eliminar una lista de tareas.", {
    id: zod_1.z.number(),
}, async ({ id }) => {
    await todoApi.DeleteTodoList(id);
    return { content: [{ type: "text", text: `Lista eliminada.` }] };
});

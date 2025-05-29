import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { TodoApi } from './todoapi.js';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";



export const server = new McpServer({
  name: "todoapi",
  version: "0.0.1"
});

const todoApi = new TodoApi(process.env.TODO_API_URL || 'https://localhost:7027');



// Tool: Crear un ítem en una lista específica
server.tool(
  "todoitem_create",
  "Crear un ítem en una lista específica.",
  {
    todoListId: z.number(),
    description: z.string(),
  },
  async ({ todoListId, description }) => {
    const item = await todoApi.createTodoItem(todoListId, description);
    return { content: [{ type: "text", text: `Ítem creado: ${item.description}` }] };
  }
);

// Tool: Actualizar un ítem existente
server.tool(
  "todoitem_update",
  "Actualizar la descripción de un ítem.",
  {
    todoListId: z.number(),
    id: z.number(),
    description: z.string(),
  },
  async ({ todoListId, id, description }) => {
    await todoApi.updateTodoItem(todoListId, id, description);
    return { content: [{ type: "text", text: `Ítem actualizado.` }] };
  }
);

// Tool: Completar un ítem
server.tool(
  "todoitem_complete",
  "Completar (marcar como finalizado) un ítem.",
  {
    todoListId: z.number(),
    id: z.number(),
  },
  async ({ todoListId, id }) => {
    await todoApi.completeTodoItem(todoListId, id);
    return { content: [{ type: "text", text: `Ítem completado.` }] };
  }
);

// Tool: Eliminar un ítem
server.tool(
  "todoitem_delete",
  "Eliminar un ítem de una lista.",
  {
    todoListId: z.number(),
    id: z.number(),
  },
  async ({ todoListId, id }) => {
    await todoApi.deleteTodoItem(todoListId, id);
    return { content: [{ type: "text", text: `Ítem eliminado.` }] };
  }
);

// Tool: Listar listas
server.tool(
  "todolist_list",
  "Listar todas las listas de tareas.",
  {},
  async () => {
    const lists = await todoApi.ListTodoLists();
    return { content: [{ type: "text", text: JSON.stringify(lists) }] };
  }
);

// Tool: Crear lista
server.tool(
  "todolist_create",
  "Crear una nueva lista de tareas.",
  {
    name: z.string(),
  },
  async ({ name }) => {
    const list = await todoApi.CreateTodoList(name);
    return { content: [{ type: "text", text: `Lista creada: ${list.name}` }] };
  }
);

// Tool: Eliminar lista
server.tool(
  "todolist_delete",
  "Eliminar una lista de tareas.",
  {
    id: z.number(),
  },
  async ({ id }) => {
    await todoApi.DeleteTodoList(id);
    return { content: [{ type: "text", text: `Lista eliminada.` }] };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});



import https from 'https'; 
import { URL } from 'url';

export interface TodoList {
  id: number;
  name: string;
}

export interface TodoItem {
  id: number;
  description: string;
  isCompleted: boolean;
  todoListId: number;
}

export class TodoApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // LISTAS
  async ListTodoLists(): Promise<TodoList[]> {
    const url = new URL(`${this.baseUrl}/api/todolists`);
    return this.request<TodoList[]>(url);
  }

  async CreateTodoList(name: string): Promise<TodoList> {
    const url = new URL(`${this.baseUrl}/api/todolists`);
    return this.request<TodoList>(url, 'POST', { name });
  }

  async DeleteTodoList(id: number): Promise<void> {
    const url = new URL(`${this.baseUrl}/api/todolists/${id}`);
    await this.request<void>(url, 'DELETE');
  }

  // ITEMS
  async createTodoItem(todoListId: number, description: string): Promise<TodoItem> {
    const url = new URL(`${this.baseUrl}/api/todolists/${todoListId}/items`);
    return this.request<TodoItem>(url, 'POST', { description });
  }

  async updateTodoItem(todoListId: number, id: number, description: string): Promise<void> {
    const url = new URL(`${this.baseUrl}/api/todolists/${todoListId}/items/${id}`);
    await this.request<void>(url, 'PUT', { id, todoListId, description });
  }

  async completeTodoItem(todoListId: number, id: number): Promise<void> {
    const url = new URL(`${this.baseUrl}/api/todolists/${todoListId}/items/${id}/complete`);
    await this.request<void>(url, 'PATCH');
  }

  async deleteTodoItem(todoListId: number, id: number): Promise<void> {
    const url = new URL(`${this.baseUrl}/api/todolists/${todoListId}/items/${id}`);
    await this.request<void>(url, 'DELETE');
  }

  // Método genérico para requests
  private request<T>(url: URL, method: string = 'GET', body?: any): Promise<T> {
    const options: https.RequestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
        rejectUnauthorized: false 
    };

    return new Promise((resolve, reject) => {
      const req = https.request(url, options, (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(raw ? JSON.parse(raw) : undefined);
            } catch (err) {
              reject(new Error(`Invalid JSON: ${err}`));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${raw}`));
          }
        });
      });

      req.on('error', reject);
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  }
}

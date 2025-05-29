"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoApi = void 0;
const https_1 = require("https");
const url_1 = require("url");
class TodoApi {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
   
    async ListTodoLists() {
        const url = new url_1.URL(`${this.baseUrl}/api/todolists`);
        return this.request(url);
    }
    async CreateTodoList(name) {
        const url = new url_1.URL(`${this.baseUrl}/api/todolists`);
        return this.request(url, 'POST', { name });
    }
    async DeleteTodoList(id) {
        const url = new url_1.URL(`${this.baseUrl}/api/todolists/${id}`);
        await this.request(url, 'DELETE');
    }
  
    async createTodoItem(todoListId, description) {
        const url = new url_1.URL(`${this.baseUrl}/api/todolists/${todoListId}/items`);
        return this.request(url, 'POST', { description });
    }
    async updateTodoItem(todoListId, id, description) {
        const url = new url_1.URL(`${this.baseUrl}/api/todolists/${todoListId}/items/${id}`);
        await this.request(url, 'PUT', { id, todoListId, description });
    }
    async completeTodoItem(todoListId, id) {
        const url = new url_1.URL(`${this.baseUrl}/api/todolists/${todoListId}/items/${id}/complete`);
        await this.request(url, 'PATCH');
    }
    async deleteTodoItem(todoListId, id) {
        const url = new url_1.URL(`${this.baseUrl}/api/todolists/${todoListId}/items/${id}`);
        await this.request(url, 'DELETE');
    }
    
    request(url, method = 'GET', body) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
             rejectUnauthorized: false
        };
        return new Promise((resolve, reject) => {
            const req = https_1.default.request(url, options, (res) => {
                let raw = '';
                res.on('data', (chunk) => (raw += chunk));
                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            resolve(raw ? JSON.parse(raw) : undefined);
                        }
                        catch (err) {
                            reject(new Error(`Invalid JSON: ${err}`));
                        }
                    }
                    else {
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
exports.TodoApi = TodoApi;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Dtos;
using TodoApi.Models;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/todolists/{todoListId}/items")]
public class TodoItemsController : ControllerBase
{
    private readonly TodoContext _context;

    public TodoItemsController(TodoContext context)
    {
        _context = context;
    }

    // 1. Crear un ítem en una lista específica
    [HttpPost]
    public async Task<ActionResult<TodoItem>> CreateTodoItem(long todoListId, TodoItem item)
    {
        item.TodoListId = todoListId;
        _context.TodoItem.Add(item);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTodoItem), new { todoListId = item.TodoListId, id = item.Id }, item);
    }

    // 2. Obtener un ítem (útil para CreatedAtAction)
    [HttpGet("{id}")]
    public async Task<ActionResult<TodoItem>> GetTodoItem(long todoListId, long id)
    {
        var item = await _context.TodoItem
            .FirstOrDefaultAsync(x => x.TodoListId == todoListId && x.Id == id);

        if (item == null)
            return NotFound();

        return item;
    }

    // 3. Actualizar un ítem existente
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTodoItem(long todoListId, long id, TodoItem updatedItem)
    {
        if (id != updatedItem.Id || todoListId != updatedItem.TodoListId)
            return BadRequest();

        _context.Entry(updatedItem).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.TodoItem.Any(e => e.Id == id && e.TodoListId == todoListId))
                return NotFound();
            else
                throw;
        }

        return NoContent();
    }

    // 4. Completar un ítem (marcar como finalizado)
    [HttpPatch("{id}/complete")]
    public async Task<IActionResult> CompleteTodoItem(long todoListId, long id)
    {
        var item = await _context.TodoItem
            .FirstOrDefaultAsync(x => x.TodoListId == todoListId && x.Id == id);

        if (item == null)
            return NotFound();

        item.IsCompleted = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // 5. Eliminar un ítem de una lista
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTodoItem(long todoListId, long id)
    {
        var item = await _context.TodoItem
            .FirstOrDefaultAsync(x => x.TodoListId == todoListId && x.Id == id);

        if (item == null)
            return NotFound();

        _context.TodoItem.Remove(item);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
namespace TodoApi.Models;

public class TodoItem
{
    public long Id { get; set; }
    public string Description { get; set; }
    public bool IsCompleted { get; set; }

    public long TodoListId { get; set; }
    
}


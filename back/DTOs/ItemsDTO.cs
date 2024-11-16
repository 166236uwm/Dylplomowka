public class ItemDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int LocationId { get; set; }
    public float DefaultUnitSize { get; set; }
    public string Unit { get; set; } = string.Empty;
    public float CurrentStock { get; set; }
}

public class CreateItemDto
{
    public string Name { get; set; } = string.Empty;
    public int LocationId { get; set; }
    public float DefaultUnitSize { get; set; }
    public string Unit { get; set; } = string.Empty;
}
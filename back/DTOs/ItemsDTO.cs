public class ItemDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public int? LocationId { get; set; }
    public float? DefaultUnitSize { get; set; }
    public string? Unit { get; set; }
    public float? CurrentStock { get; set; }
    public float? RequiredStock { get; set; }
    public float? Price { get; set; }
    public string? Status { get; set; }
}

public class CreateItemDto
{
    public string Name { get; set; } = string.Empty;
    public int LocationId { get; set; }
    public float DefaultUnitSize { get; set; }
    public string Unit { get; set; } = string.Empty;
    public float Price { get; set; }

}
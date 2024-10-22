public class ItemDto
{
    public int ItemId { get; set; }
    public required string ItemName { get; set; }
    public float CurrentStock { get; set; } // Add this line
    public int LocationId { get; set; }
    public float DefaultUnitSize { get; set; }
    public required string Unit { get; set; }
}
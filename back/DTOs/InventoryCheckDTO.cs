public class InventoryCheckDto
{
    public List<InventoryCheckItemDto> InventoryCheckItems { get; set; } = new List<InventoryCheckItemDto>();
    public required string Status { get; set; }
    public DateTime CheckedAt { get; set; }
    public int UserId { get; set; }
}

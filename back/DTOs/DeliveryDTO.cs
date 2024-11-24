public class DeliveryDto
{
    public DateTime BookedAt { get; set; }
    public DateTime DeliveredAt { get; set; }
    public float Price { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; } = "saved";
    public List<DeliveredItemDto> DeliveredItems { get; set; } = new List<DeliveredItemDto>();
}

public class DeliveredItemDto
{
    public int ItemId { get; set; }
    public int Amount { get; set; }
}
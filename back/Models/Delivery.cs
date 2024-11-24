public class Delivery
{
    public int Id { get; set; }
    public DateTime BookedAt { get; set; }
    public DateTime DeliveredAt { get; set; }
    public float Price { get; set; }
    public int UserId { get; set; }
    public string Status { get; set; } = "saved"; 

    public required User User { get; set; }
    public required ICollection<DeliveredItem> DeliveredItems { get; set; }
}

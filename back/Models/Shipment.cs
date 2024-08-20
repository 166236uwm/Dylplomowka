public class Shipment
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ShippedAt { get; set; }
    public int UserId { get; set; }

    // Właściwości nawigacyjne
    public User User { get; set; }
    public ICollection<ShipmentItem> ShipmentItems { get; set; }
}

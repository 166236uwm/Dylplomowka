public class DeliveredItem
{
    public int ItemId { get; set; }
    public int DeliveryId { get; set; }
    public int Amount { get; set; }

    // Właściwości nawigacyjne
    public Item Item { get; set; } = null!; // Use null-forgiving operator if you are sure it will be initialized
    public Delivery Delivery { get; set; } = null!; // Same here
}

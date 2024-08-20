public class DeliveredItem
{
    public int ItemId { get; set; }
    public int DeliveryId { get; set; }
    public int Amount { get; set; }

    // Właściwości nawigacyjne
    public Item Item { get; set; }
    public Delivery Delivery { get; set; }
}

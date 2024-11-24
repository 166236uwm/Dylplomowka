public class DeliveredItem
{
    public int ItemId { get; set; }
    public int DeliveryId { get; set; }
    public int Amount { get; set; }

    public required Item Item { get; set; }
    public required Delivery Delivery { get; set; }
}
public class ShipmentItem
{
    public int ItemId { get; set; }
    public int ShipmentId { get; set; }
    public int Amount { get; set; }

    // Właściwości nawigacyjne
    public Item Item { get; set; }
    public Shipment Shipment { get; set; }
}

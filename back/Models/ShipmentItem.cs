public class ShipmentItem
{
    public int ItemId { get; set; }
    public int ShipmentId { get; set; }
    public int Amount { get; set; }

    // Właściwości nawigacyjne
    public required Item Item { get; set; }
    public required Shipment Shipment { get; set; }
}

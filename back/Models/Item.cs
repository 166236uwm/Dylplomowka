public class Item
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required int LocationId { get; set; }
    public required float DefaultUnitSize { get; set; }
    public required string Unit { get; set; }

    // Właściwości nawigacyjne
    public required Location Location { get; set; }
    public ICollection<DeliveredItem>? DeliveredItems { get; set; }
    public ICollection<ShipmentItem>? ShipmentItems { get; set; }
    public ICollection<InventoryCheckItem>? InventoryCheckItems { get; set; }
}

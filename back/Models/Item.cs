public class Item
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int LocationId { get; set; }
    public float DefaultUnitSize { get; set; }
    public string Unit { get; set; }

    // Właściwości nawigacyjne
    public Location Location { get; set; }
    public ICollection<DeliveredItem> DeliveredItems { get; set; }
    public ICollection<ShipmentItem> ShipmentItems { get; set; }
    public ICollection<InventoryCheckItem> InventoryCheckItems { get; set; }
}

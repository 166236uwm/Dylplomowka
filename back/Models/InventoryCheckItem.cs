public class InventoryCheckItem
{
    public int ItemId { get; set; }
    public int InventoryCheckId { get; set; }
    public float RecordedAmount { get; set; }

    // Właściwości nawigacyjne
    public Item? Item { get; set; }
    public InventoryCheck? InventoryCheck { get; set; }
}

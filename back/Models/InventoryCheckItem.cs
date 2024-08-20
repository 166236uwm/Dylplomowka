public class InventoryCheckItem
{
    public int ItemId { get; set; }            // Id towaru (foreign key)
    public int InventoryCheckId { get; set; }  // Id inwentaryzacji (foreign key)
    public int ActualAmount { get; set; }      // Rzeczywista ilość towaru podczas inwentaryzacji

    // Relacje
    public Item Item { get; set; }             // Towar, który został sprawdzony
    public InventoryCheck InventoryCheck { get; set; }  // Inwentaryzacja, podczas której towar został sprawdzony
}

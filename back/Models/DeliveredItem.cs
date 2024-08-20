public class DeliveredItem
{
    public int ItemId { get; set; }         // Id towaru (foreign key)
    public int DeliveryId { get; set; }     // Id dostawy (foreign key)
    public int Amount { get; set; }         // Ilość dostarczonego towaru

    // Relacje
    public Item Item { get; set; }          // Towar, który został dostarczony
    public Delivery Delivery { get; set; }  // Dostawa, w ramach której towar został dostarczony
}

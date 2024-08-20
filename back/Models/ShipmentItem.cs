public class ShipmentItem
{
    public int ItemId { get; set; }         // Id towaru (foreign key)
    public int ShipmentId { get; set; }     // Id wysyłki (foreign key)
    public int Amount { get; set; }         // Ilość wysłanego towaru

    // Relacje
    public Item Item { get; set; }          // Towar, który został wysłany
    public Shipment Shipment { get; set; }  // Wysyłka, w ramach której towar został wysłany
}

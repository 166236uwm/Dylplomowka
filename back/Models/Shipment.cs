public class Shipment
{
    public int Id { get; set; }            // Unikalny identyfikator wysyłki (primary key)
    public DateTime ShippedAt { get; set; } // Data wysyłki
    public int UserId { get; set; }        // Id użytkownika odpowiedzialnego za wysyłkę (foreign key)

    // Relacje
    public User User { get; set; }          // Użytkownik odpowiedzialny za wysyłkę
    public ICollection<ShipmentItem> ShipmentItems { get; set; }  // Kolekcja wysłanych towarów
}

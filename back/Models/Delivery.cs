public class Delivery
{
    public int Id { get; set; }             // Unikalny identyfikator dostawy (primary key)
    public DateTime BookedAt { get; set; }  // Data zarezerwowania dostawy
    public DateTime DeliveredAt { get; set; }  // Data dostarczenia towaru
    public float Price { get; set; }        // Cena dostawy
    public int UserId { get; set; }         // Id użytkownika odpowiedzialnego za dostawę (foreign key)

    // Relacje
    public User User { get; set; }          // Użytkownik odpowiedzialny za dostawę
    public ICollection<DeliveredItem> DeliveredItems { get; set; }  // Kolekcja dostarczonych towarów
}

public class InventoryCheck
{
    public int Id { get; set; }             // Unikalny identyfikator inwentaryzacji (primary key)
    public DateTime CheckedAt { get; set; } // Data przeprowadzenia inwentaryzacji
    public int UserId { get; set; }         // Id użytkownika przeprowadzającego inwentaryzację (foreign key)

    // Relacje
    public User User { get; set; }          // Użytkownik odpowiedzialny za inwentaryzację
    public ICollection<InventoryCheckItem> InventoryCheckItems { get; set; }  // Kolekcja sprawdzonych towarów
}

public class User
{
    public int Id { get; set; }           // Unikalny identyfikator użytkownika (primary key)
    public string Username { get; set; }  // Nazwa użytkownika (login)
    public string Name { get; set; }      // Imię użytkownika
    public string Surname { get; set; }   // Nazwisko użytkownika
    public string Email { get; set; }     // Email użytkownika
    public string Role { get; set; }      // Rola użytkownika (np. "Admin", "Manager", "Magazynier")
    public DateTime CreatedAt { get; set; }  // Data utworzenia konta użytkownika

    // Relacje
    public ICollection<Delivery> Deliveries { get; set; }  // Kolekcja dostaw przypisanych do użytkownika
}

public class Location
{
    public int Id { get; set; }           // Unikalny identyfikator lokalizacji (primary key)
    public string Name { get; set; }      // Nazwa lokalizacji

    // Relacje
    public ICollection<Item> Items { get; set; }  // Kolekcja towarów przypisanych do tej lokalizacji
}

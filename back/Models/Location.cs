public class Location
{
    public int Id { get; set; }           // Unikalny identyfikator lokalizacji (primary key)
    public string Name { get; set; } = null!;      // Nazwa lokalizacji

    // Relacje
    public List<Item> Items { get; set; } = new(); // Initialize to an empty list
}

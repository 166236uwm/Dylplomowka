public class Item
{
    public int Id { get; set; }            // Unikalny identyfikator towaru (primary key)
    public string Name { get; set; }       // Nazwa towaru
    public int LocationId { get; set; }    // Id lokalizacji, gdzie towar jest przechowywany (foreign key)
    public float DefaultUnitSize { get; set; }  // Domyślny rozmiar jednostki towaru
    public string Unit { get; set; }       // Jednostka miary (np. "kg", "szt")
    public int CurrentStock { get; set; }  // Aktualny stan magazynowy
    public int ReorderThreshold { get; set; }  // Próg, poniżej którego generowane jest zamówienie

    // Relacje
    public Location Location { get; set; }    // Lokalizacja, gdzie towar jest przechowywany
    public ICollection<DeliveredItem> DeliveredItems { get; set; }  // Kolekcja dostarczonych towarów
}

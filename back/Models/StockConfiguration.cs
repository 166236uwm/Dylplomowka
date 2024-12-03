public class StockConfiguration
{
    public int Id { get; set; }
    public int DefaultStockDays { get; set; } = 7; // Domyślnie 7 dni
    public int LeadTimeDays { get; set; } = 2;    // Domyślnie 2 dni
}

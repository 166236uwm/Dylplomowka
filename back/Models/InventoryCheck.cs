public class InventoryCheck
{
    public int Id { get; set; }
    public DateTime CheckedAt { get; set; }
    public int UserId { get; set; }

    // Właściwości nawigacyjne
    public User User { get; set; } = null!;
    public List<InventoryCheckItem> InventoryCheckItems { get; set; } = new(); // Initialize to an empty list
}

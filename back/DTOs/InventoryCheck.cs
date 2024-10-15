public class InventoryCheckDto
{
    public int UserId { get; set; }
    public required List<int> ItemIds { get; set; } // Added 'required' modifier
}

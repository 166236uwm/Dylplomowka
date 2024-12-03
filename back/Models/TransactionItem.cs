public class TransactionItem
{
    public int ItemId { get; set; }
    public int TransactionId { get; set; }
    public int Amount { get; set; }
    public float Price { get; set; }

    public required Item Item { get; set; }
    public required Transaction Transaction { get; set; }
}
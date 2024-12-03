public class Transaction
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
    public float TotalPrice { get; set; }

    public required User User { get; set; }
    public ICollection<TransactionItem> TransactionItems { get; set; } = new List<TransactionItem>();
}

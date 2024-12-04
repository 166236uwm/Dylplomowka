public class TransactionSummaryDto
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Username { get; set; } = string.Empty;
    public float TotalPrice { get; set; }
}

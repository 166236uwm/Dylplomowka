public class TransactionDto
{
    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
    public List<TransactionItemDto> TransactionItems { get; set; } = new List<TransactionItemDto>();
}
using Microsoft.EntityFrameworkCore;

public class TransactionService : ITransactionService
{
    private readonly ApplicationDbContext _context;

    public TransactionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Transaction> CreateTransactionAsync(TransactionDto transactionDto)
    {
        var user = await _context.Users.FindAsync(transactionDto.UserId);
        if (user == null)
        {
            throw new ArgumentException("Invalid UserId");
        }

        var transaction = new Transaction
        {
            CreatedAt = DateTime.UtcNow,
            UserId = user.Id,
            User = user,
            TransactionItems = transactionDto.TransactionItems.Select(item => new TransactionItem
            {
                ItemId = item.ItemId,
                Amount = item.Amount,
                Price = _context.Items.Find(item.ItemId)?.Price ?? throw new ArgumentException("Invalid ItemId"),
                Item = _context.Items.Find(item.ItemId) ?? throw new ArgumentException("Invalid ItemId"),
                Transaction = null
            }).ToList()
        };

        foreach (var transactionItem in transaction.TransactionItems)
        {
            transactionItem.Transaction = transaction;
        }

        transaction.TotalPrice = transaction.TransactionItems.Sum(ti => ti.Amount * ti.Price);

        foreach (var transactionItem in transaction.TransactionItems)
        {
            transactionItem.Item.CurrentStock -= transactionItem.Amount;
        }

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();
        return transaction;
    }

    public async Task<TransactionDto?> GetTransactionAsync(int id)
{
    var transaction = await _context.Transactions
        .Include(t => t.TransactionItems)
        .ThenInclude(ti => ti.Item)
        .Include(t => t.User)
        .FirstOrDefaultAsync(t => t.Id == id);

    if (transaction == null)
    {
        return null;
    }

    return new TransactionDto
    {
        CreatedAt = transaction.CreatedAt,
        UserId = transaction.UserId,
        TotalPrice = transaction.TotalPrice,
        TransactionItems = transaction.TransactionItems.Select(ti => new TransactionItemDto
        {
            ItemId = ti.ItemId,
            Amount = ti.Amount
        }).ToList()
    };
}


    public async Task<IEnumerable<TransactionSummaryDto>> GetAllTransactionsAsync()
    {
        return await _context.Transactions
            .Include(t => t.User)
            .Select(t => new TransactionSummaryDto
            {
                Id = t.Id,
                CreatedAt = t.CreatedAt,
                Username = t.User.Username,
                TotalPrice = t.TotalPrice
            })
            .ToListAsync();
    }

}
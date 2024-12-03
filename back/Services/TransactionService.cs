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

    public async Task<Transaction> GetTransactionAsync(int id)
    {
        return await _context.Transactions
            .Include(t => t.TransactionItems)
            .ThenInclude(ti => ti.Item)
            .Include(t => t.User)
            .FirstOrDefaultAsync(t => t.Id == id) ?? throw new InvalidOperationException("Transaction not found");
    }

    public async Task<IEnumerable<Transaction>> GetAllTransactionsAsync()
    {
        return await _context.Transactions
            .Include(t => t.TransactionItems)
            .ThenInclude(ti => ti.Item)
            .Include(t => t.User)
            .ToListAsync();
    }
}
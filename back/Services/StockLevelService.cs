using Microsoft.EntityFrameworkCore;

public class StockLevelService : IStockLevelService
{
    private readonly ApplicationDbContext _context;

    public StockLevelService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task CheckStockLevelsAsync()
    {
        var config = await _context.StockConfigurations.OrderBy(c => c.Id).FirstOrDefaultAsync();
        if (config == null)
        {
            throw new InvalidOperationException("Brak konfiguracji magazynu.");
        }

        var items = await _context.Items.Include(i => i.TransactionItems).ToListAsync();

        foreach (var item in items)
        {
            if (item.TransactionItems == null || !item.TransactionItems.Any())
            {
                continue;
            }

            // Ensure that Transaction is not null
            var transactionItemsWithTransaction = item.TransactionItems.Where(ti => ti.Transaction != null).ToList();
            if (!transactionItemsWithTransaction.Any())
            {
                continue;
            }

            // Oblicz średnie dzienne zużycie
            var totalConsumption = transactionItemsWithTransaction.Sum(ti => ti.Amount);
            var daysCount = (DateTime.UtcNow - transactionItemsWithTransaction.Min(ti => ti.Transaction!.CreatedAt)).TotalDays;
            var dailyUsage = daysCount > 0 ? totalConsumption / daysCount : 0;

            // Oblicz minimalny zapas
            var requiredStock = dailyUsage * (config.DefaultStockDays + config.LeadTimeDays);

            // Aktualizuj status, jeśli potrzebne
            if (item.CurrentStock < requiredStock)
            {
                item.Status = "toOrder";
            }
            else
            {
                item.Status = "available";
            }
        }

        await _context.SaveChangesAsync();
    }
}

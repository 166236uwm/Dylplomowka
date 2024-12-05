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

        var items = await _context.Items
            .Include(i => i.TransactionItems)
            .ThenInclude(ti => ti.Transaction)
            .ToListAsync();

        foreach (var item in items)
        {
            if (item.TransactionItems == null || !item.TransactionItems.Any())
            {
                continue;
            }

            var transactionItemsWithTransaction = item.TransactionItems.Where(ti => ti.Transaction != null).ToList();
            if (!transactionItemsWithTransaction.Any())
            {
                continue;
            }

            var totalConsumption = transactionItemsWithTransaction.Sum(ti => ti.Amount);
            var daysCount = (DateTime.UtcNow - transactionItemsWithTransaction.Min(ti => ti.Transaction!.CreatedAt)).TotalDays;
            var dailyUsage = daysCount > 0 ? totalConsumption / daysCount : 0;

            var requiredStock = dailyUsage * ((config.DefaultStockDays + config.LeadTimeDays) * (1 + config.SafetyStock));

            Console.WriteLine($"{item.Name}: {requiredStock}");

            item.RequiredStock = (float)requiredStock;

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

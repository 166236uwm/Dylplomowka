using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

public class StockConfigurationService : IStockConfigurationService
{
    private readonly ApplicationDbContext _context;

    public StockConfigurationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<StockConfiguration>> GetAllAsync()
    {
        return await _context.StockConfigurations.ToListAsync();
    }

    public async Task<StockConfiguration> GetByIdAsync(int id)
    {
        return await _context.StockConfigurations.FindAsync(id);
    }

    public async Task<StockConfiguration> CreateAsync(StockConfigurationDto dto)
    {
        var configuration = new StockConfiguration
        {
            DefaultStockDays = dto.DefaultStockDays,
            LeadTimeDays = dto.LeadTimeDays,
            SafetyStock = dto.SafetyStock
        };
        _context.StockConfigurations.Add(configuration);
        await _context.SaveChangesAsync();
        return configuration;
    }

    public async Task<bool> UpdateAsync(int id, StockConfigurationDto dto)
    {
        var configuration = await _context.StockConfigurations.FindAsync(id);
        if (configuration == null)
        {
            return false;
        }
        configuration.DefaultStockDays = dto.DefaultStockDays;
        configuration.LeadTimeDays = dto.LeadTimeDays;
        configuration.SafetyStock = dto.SafetyStock;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var configuration = await _context.StockConfigurations.FindAsync(id);
        if (configuration == null)
        {
            return false;
        }
        _context.StockConfigurations.Remove(configuration);
        await _context.SaveChangesAsync();
        return true;
    }
}
using Microsoft.EntityFrameworkCore;

public class InventoryCheckService : IInventoryCheckService
{
    private readonly ApplicationDbContext _context;

    public InventoryCheckService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<InventoryCheck> CreateInventoryCheckAsync(InventoryCheckDto checkDto)
    {
        var inventoryCheck = new InventoryCheck
        {
            CheckedAt = DateTime.UtcNow,
            UserId = checkDto.UserId,
            InventoryCheckItems = checkDto.ItemIds.Select(itemId => new InventoryCheckItem
            {
                ItemId = itemId,
                RecordedAmount = 0 // Initialize with zero until counted
            }).ToList()
        };

        _context.InventoryChecks.Add(inventoryCheck);
        await _context.SaveChangesAsync();
        return inventoryCheck;
    }

    public async Task<InventoryCheck> GetInventoryCheckAsync(int id)
    {
        return await _context.InventoryChecks
            .Include(ic => ic.InventoryCheckItems)
            .ThenInclude(ici => ici.Item)
            .FirstOrDefaultAsync(ic => ic.Id == id) ?? new InventoryCheck(); // Return a new InventoryCheck if null
    }

    public async Task<IEnumerable<InventoryCheck>> GetAllInventoryChecksAsync()
    {
        return await _context.InventoryChecks
            .Include(ic => ic.User)
            .ToListAsync();
    }

    public async Task UpdateInventoryCheckAsync(int id, InventoryCheckDto checkDto)
    {
        var inventoryCheck = await _context.InventoryChecks.FindAsync(id);
        if (inventoryCheck == null)
        {
            throw new KeyNotFoundException("Inventory check not found.");
        }

        inventoryCheck.UserId = checkDto.UserId;
        // Update other properties as needed

        await _context.SaveChangesAsync();
    }

    public async Task DeleteInventoryCheckAsync(int id)
    {
        var inventoryCheck = await _context.InventoryChecks.FindAsync(id);
        if (inventoryCheck == null)
        {
            throw new KeyNotFoundException("Inventory check not found.");
        }

        _context.InventoryChecks.Remove(inventoryCheck);
        await _context.SaveChangesAsync();
    }
}

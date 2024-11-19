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
            InventoryCheckItems = checkDto.InventoryCheckItems.Select(item => new InventoryCheckItem
            {
                ItemId = item.Id,
                RecordedAmount = item.RecordedAmount
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

    public async Task<bool> UpdateInventoryCheckAsync(int id, InventoryCheckDto checkDto)
    {
        var inventoryCheck = await _context.InventoryChecks
            .Include(ic => ic.InventoryCheckItems)
            .FirstOrDefaultAsync(ic => ic.Id == id);

        if (inventoryCheck == null)
        {
            return false;
        }

        // Update inventory check items
        inventoryCheck.InventoryCheckItems.Clear();
        foreach (var itemDto in checkDto.InventoryCheckItems)
        {
            inventoryCheck.InventoryCheckItems.Add(new InventoryCheckItem
            {
                ItemId = itemDto.Id,
                RecordedAmount = itemDto.RecordedAmount
            });
        }

        // Update other properties as needed
        inventoryCheck.Status = checkDto.Status;
        inventoryCheck.CheckedAt = checkDto.CheckedAt;
        inventoryCheck.UserId = checkDto.UserId;

        await _context.SaveChangesAsync();
        return true;
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

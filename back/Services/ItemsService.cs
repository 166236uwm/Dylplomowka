using Microsoft.EntityFrameworkCore; // Add this line to resolve the Include method issue

public class ItemService : IItemService
{
    private readonly ApplicationDbContext _context;

    public ItemService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ItemDto>> GetItemsAsync()
    {
        return await _context.Items
            .Select(i => new ItemDto
            {
                ItemId = i.Id,
                ItemName = i.Name,
                LocationId = i.LocationId,
                DefaultUnitSize = i.DefaultUnitSize,
                Unit = i.Unit
            })
            .ToListAsync();
    }

    public async Task<Item> GetItemAsync(int id)
    {
        var item = await _context.Items.Include(i => i.Location).FirstOrDefaultAsync(i => i.Id == id);
        if (item == null) 
        {
            // Handle the null case, e.g., throw an exception or return a default value
            throw new InvalidOperationException("Item not found.");
        }
        return item;
    }

    public async Task<Item> CreateItemAsync(Item item)
    {
        _context.Items.Add(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task UpdateItemAsync(int id, Item item)
    {
        if (id != item.Id)
        {
            throw new ArgumentException("Item ID mismatch");
        }

        _context.Entry(item).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteItemAsync(int id)
    {
        var item = await _context.Items.FindAsync(id);
        if (item == null)
        {
            throw new KeyNotFoundException("Item not found");
        }

        _context.Items.Remove(item);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<object>> GetItemsGroupedByLocationAsync()
    {
        var items = await _context.Items.Include(i => i.Location).ToListAsync();
        var groupedItems = items.GroupBy(i => i.LocationId)
            .Select(g => new
            {
                LocationId = g.Key,
                LocationName = g.First().Location.Name, // Assuming Location is included in Item
                Items = g.Select(i => new
                {
                    i.Id,
                    i.Name,
                    i.CurrentStock // Simplified property assignment
                }).ToList()
            }).ToList();

        Console.WriteLine($"Grouped Items Count: {groupedItems.Count}"); // Log the count of grouped items
        return groupedItems;
    }
}

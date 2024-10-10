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
}
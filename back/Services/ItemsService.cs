using Microsoft.EntityFrameworkCore; 

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
                Id = i.Id,
                Name = i.Name,
                CurrentStock = i.CurrentStock,
                LocationId = i.LocationId,
                DefaultUnitSize = i.DefaultUnitSize,
                Unit = i.Unit,
                Price = i.Price
            })
            .ToListAsync();
    }

    public async Task<Item> GetItemAsync(int id)
    {
        var item = await _context.Items.Include(i => i.Location).FirstOrDefaultAsync(i => i.Id == id);
        if (item == null)
        {
            throw new InvalidOperationException("Item not found.");
        }
        return item;
    }

    public async Task<ItemDto> CreateItemAsync(CreateItemDto createItemDto)
    {
        var location = await _context.Locations.FindAsync(createItemDto.LocationId);
        if (location == null)
        {
            throw new KeyNotFoundException("Location not found");
        }

        var item = new Item
        {
            Name = createItemDto.Name,
            LocationId = createItemDto.LocationId,
            Location = location,
            DefaultUnitSize = createItemDto.DefaultUnitSize,
            Unit = createItemDto.Unit,
            CurrentStock = 0,
            RequiredStock = 0,
            Price = createItemDto.Price,
            Status = "available"
        };

        _context.Items.Add(item);
        await _context.SaveChangesAsync();

        return new ItemDto
        {
            Id = item.Id,
            Name = item.Name,
            LocationId = item.LocationId,
            DefaultUnitSize = item.DefaultUnitSize,
            Unit = item.Unit,
            Price = item.Price
        };
    }

    public async Task UpdateItemAsync(int id, ItemDto itemDto)
    {
        var existingItem = await _context.Items.FindAsync(id);
        if (existingItem == null)
        {
            throw new KeyNotFoundException("Item not found");
        }

        if (itemDto.LocationId.HasValue)
        {
            var location = await _context.Locations.FindAsync(itemDto.LocationId.Value);
            if (location == null)
            {
                throw new KeyNotFoundException("Location not found");
            }
            existingItem.LocationId = itemDto.LocationId.Value;
            existingItem.Location = location;
        }

        if (!string.IsNullOrEmpty(itemDto.Name))
        {
            existingItem.Name = itemDto.Name;
        }

        if (itemDto.CurrentStock.HasValue)
        {
            existingItem.CurrentStock = itemDto.CurrentStock.Value;
        }

        if (itemDto.DefaultUnitSize.HasValue)
        {
            existingItem.DefaultUnitSize = itemDto.DefaultUnitSize.Value;
        }

        if (!string.IsNullOrEmpty(itemDto.Unit))
        {
            existingItem.Unit = itemDto.Unit;
        }

        if (itemDto.Price.HasValue)
        {
            existingItem.Price = itemDto.Price.Value;
        }

        if (!string.IsNullOrEmpty(itemDto.Status))
        {
            existingItem.Status = itemDto.Status;
        }

        _context.Entry(existingItem).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ItemExists(id))
            {
                throw new KeyNotFoundException("Item not found");
            }
            else
            {
                throw;
            }
        }
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
                LocationName = g.First().Location.Name,
                Items = g.Select(i => new
                {
                    i.Id,
                    i.Name,
                    i.CurrentStock,
                    i.DefaultUnitSize,
                    i.Unit,
                    i.Price
                }).ToList()
            }).ToList();

        return groupedItems;
    }

    private bool ItemExists(int id)
    {
        return _context.Items.Any(e => e.Id == id);
    }
}

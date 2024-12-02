using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

public class DeliveryService : IDeliveryService
{
    private readonly ApplicationDbContext _context;

    public DeliveryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Delivery> CreateDeliveryAsync(DeliveryDto deliveryDto)
    {
        var user = await _context.Users.FindAsync(deliveryDto.UserId);
        if (user == null)
        {
            throw new ArgumentException("Invalid UserId");
        }

        var delivery = new Delivery
        {
            BookedAt = DateTime.UtcNow,
            Status = "saved",
            UserId = deliveryDto.UserId,
            User = user,
            DeliveredItems = new List<DeliveredItem>()
        };

        delivery.DeliveredItems = deliveryDto.DeliveredItems.Select(item => new DeliveredItem
        {
            ItemId = item.ItemId,
            Amount = item.Amount,
            Item = _context.Items.Find(item.ItemId) ?? throw new ArgumentException("Invalid ItemId"),
            Delivery = delivery
        }).ToList();

        _context.Deliveries.Add(delivery);
        await _context.SaveChangesAsync();
        return delivery;
    }

    public async Task<Delivery> GetDeliveryAsync(int id)
    {
        return await _context.Deliveries
            .Include(d => d.DeliveredItems)
            .ThenInclude(di => di.Item)
            .Include(d => d.User)
            .FirstOrDefaultAsync(d => d.Id == id) ?? throw new InvalidOperationException("Delivery not found");
    }

    public async Task<IEnumerable<Delivery>> GetAllDeliveriesAsync()
    {
        return await _context.Deliveries
            .Include(d => d.DeliveredItems)
            .ThenInclude(di => di.Item)
            .Include(d => d.User)
            .ToListAsync();
    }

    public async Task<bool> UpdateDeliveryAsync(int id, DeliveryDto deliveryDto)
    {
        var delivery = await _context.Deliveries
            .Include(d => d.DeliveredItems)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (delivery == null)
        {
            return false;
        }

        delivery.DeliveredItems.Clear();
        foreach (var itemDto in deliveryDto.DeliveredItems)
        {
            delivery.DeliveredItems.Add(new DeliveredItem
            {
                ItemId = itemDto.ItemId,
                Amount = itemDto.Amount,
                Item = _context.Items.Find(itemDto.ItemId) ?? throw new ArgumentException("Invalid ItemId"),
                Delivery = delivery
            });
        }

        delivery.Status = deliveryDto.Status;
        delivery.BookedAt = deliveryDto.BookedAt;
        delivery.DeliveredAt = deliveryDto.DeliveredAt;
        delivery.UserId = deliveryDto.UserId;
        delivery.User = await _context.Users.FindAsync(deliveryDto.UserId) ?? throw new ArgumentException("Invalid UserId");

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> BookDeliveryAsync(int id)
    {
        var delivery = await _context.Deliveries.FindAsync(id);
        if (delivery == null || delivery.Status != "saved")
        {
            return false;
        }

        delivery.Status = "ordered";
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> MarkAsShippedAsync(int id)
    {
        var delivery = await _context.Deliveries
            .Include(d => d.DeliveredItems)
            .ThenInclude(di => di.Item)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (delivery == null || delivery.Status != "ordered")
        {
            return false;
        }

        delivery.Status = "shipped";
        delivery.DeliveredAt = DateTime.UtcNow;

        // Update current stock for each delivered item
        foreach (var deliveredItem in delivery.DeliveredItems)
        {
            deliveredItem.Item.CurrentStock += deliveredItem.Amount;
        }

        await _context.SaveChangesAsync();
        return true;
    }
}
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IItemService _itemService;
    private readonly ApplicationDbContext _context;
    public ItemsController(IItemService itemService, ApplicationDbContext context)
    {
        _itemService = itemService ?? throw new ArgumentNullException(nameof(itemService));
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }


    [HttpGet]
    [Authorize(Roles = "User, Manager, Admin")]
    public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
    {
        var items = await _itemService.GetItemsAsync();
        return Ok(items);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "User, Manager, Admin")]
    public async Task<ActionResult<Item>> GetItem(int id)
    {
        var item = await _itemService.GetItemAsync(id);
        if (item == null)
        {
            return NotFound();
        }
        return Ok(item);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Item>> CreateItem(CreateItemDto createItemDto)
    {
        var createdItem = await _itemService.CreateItemAsync(createItemDto);
        return CreatedAtAction(nameof(GetItem), new { id = createdItem.Id }, createdItem);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateItem(int id, [FromBody] ItemDto itemDto)
    {
        try
        {
            await _itemService.UpdateItemAsync(id, itemDto);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (DbUpdateConcurrencyException)
        {
            return Conflict("The item was modified or deleted by another process.");
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        await _itemService.DeleteItemAsync(id);
        return NoContent();
    }

    [HttpGet("grouped-by-location")]
    [Authorize(Roles = "User, Manager, Admin")]
    public async Task<ActionResult<IEnumerable<object>>> GetItemsGroupedByLocation()
    {
        var groupedItems = await _itemService.GetItemsGroupedByLocationAsync();
        return Ok(groupedItems);
    }
    [HttpGet("toOrder")]
    [Authorize(Roles = "Manager, Admin")]
    public async Task<ActionResult<IEnumerable<Item>>> GetItemsToOrder()
    {
        var itemsToOrder = await _context.Items
            .Where(i => i.Status == "toOrder")
            .ToListAsync();

        return Ok(itemsToOrder);
    }

}

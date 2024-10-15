using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

public class ItemsController : ControllerBase
{
    private readonly IItemService _itemService;

    public ItemsController(IItemService itemService)
    {
        _itemService = itemService;
    }

    [HttpGet("api/Items")]
    [Authorize(Roles = "User, Manager, Admin")]
    public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
    {
        var items = await _itemService.GetItemsAsync();
        return Ok(items);
    }

    [HttpGet("api/Items/{id}")]
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

    [HttpPost("api/Items")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Item>> CreateItem(Item item)
    {
        var createdItem = await _itemService.CreateItemAsync(item);
        return CreatedAtAction(nameof(GetItem), new { id = createdItem.Id }, createdItem);
    }

    [HttpPut("api/Items/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateItem(int id, Item item)
    {
        await _itemService.UpdateItemAsync(id, item);
        return NoContent();
    }

    [HttpDelete("api/Items/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteItem(int id)
    {
        await _itemService.DeleteItemAsync(id);
        return NoContent();
    }

    [HttpGet("api/Items/grouped-by-location")]
    [Authorize(Roles = "User, Manager, Admin")]
    public async Task<ActionResult<IEnumerable<object>>> GetItemsGroupedByLocation()
    {
        var groupedItems = await _itemService.GetItemsGroupedByLocationAsync();
        return Ok(groupedItems);
    }
}

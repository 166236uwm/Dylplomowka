using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class InventoryCheckController : ControllerBase
{
    private readonly IInventoryCheckService _inventoryCheckService;
    private readonly ApplicationDbContext _context;

    public InventoryCheckController(IInventoryCheckService inventoryCheckService, ApplicationDbContext context)
    {
        _inventoryCheckService = inventoryCheckService;
        _context = context;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateInventoryCheck([FromBody] InventoryCheckDto inventoryCheckDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (userId == null)
        {
            return BadRequest("User ID is required.");
        }

        var inventoryCheck = new InventoryCheck
        {
            CheckedAt = DateTime.UtcNow,
            UserId = int.Parse(userId),
            Status = "saved", // Set status to saved
            InventoryCheckItems = inventoryCheckDto.InventoryCheckItems.Select(item => new InventoryCheckItem
            {
                ItemId = item.Id,
                RecordedAmount = item.RecordedAmount
            }).ToList()
        };

        _context.InventoryChecks.Add(inventoryCheck);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetInventoryCheck), new { id = inventoryCheck.Id }, inventoryCheck);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "User, Manager, Admin")]
    public async Task<ActionResult<InventoryCheck>> GetInventoryCheck(int id)
    {
        var inventoryCheck = await _inventoryCheckService.GetInventoryCheckAsync(id);
        if (inventoryCheck == null)
        {
            return NotFound();
        }
        return Ok(inventoryCheck);
    }

    [HttpGet]
    [Authorize(Roles = "User, Manager, Admin")]
    public async Task<ActionResult<IEnumerable<InventoryCheck>>> GetAllInventoryChecks()
    {
        var inventoryChecks = await _inventoryCheckService.GetAllInventoryChecksAsync();
        return Ok(inventoryChecks);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Manager, Admin")]
    public async Task<IActionResult> UpdateInventoryCheck(int id, [FromBody] InventoryCheckDto checkDto)
    {
        await _inventoryCheckService.UpdateInventoryCheckAsync(id, checkDto);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteInventoryCheck(int id)
    {
        await _inventoryCheckService.DeleteInventoryCheckAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/book")]
    [Authorize(Roles = "Manager, Admin")]
    public async Task<IActionResult> BookInventoryCheck(int id)
    {
        var inventoryCheck = await _context.InventoryChecks
            .Include(ic => ic.InventoryCheckItems)
            .ThenInclude(ici => ici.Item)
            .FirstOrDefaultAsync(ic => ic.Id == id);

        if (inventoryCheck == null)
        {
            return NotFound();
        }

        if (inventoryCheck.Status == "booked")
        {
            return BadRequest("Inventory check is already booked.");
        }

        foreach (var item in inventoryCheck.InventoryCheckItems)
        {
            var dbItem = await _context.Items.FindAsync(item.ItemId);
            if (dbItem != null)
            {
                dbItem.CurrentStock = item.RecordedAmount;
            }
        }

        inventoryCheck.Status = "booked";
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

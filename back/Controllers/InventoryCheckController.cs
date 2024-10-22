using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
            UserId = int.Parse(userId), // Set UserId from the token
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
}

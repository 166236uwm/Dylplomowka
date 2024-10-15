using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class InventoryCheckController : ControllerBase
{
    private readonly IInventoryCheckService _inventoryCheckService;

    public InventoryCheckController(IInventoryCheckService inventoryCheckService)
    {
        _inventoryCheckService = inventoryCheckService;
    }

    [HttpPost]
    [Authorize(Roles = "Manager, Admin")]
    public async Task<ActionResult<InventoryCheck>> CreateInventoryCheck([FromBody] InventoryCheckDto checkDto)
    {
        var inventoryCheck = await _inventoryCheckService.CreateInventoryCheckAsync(checkDto);
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
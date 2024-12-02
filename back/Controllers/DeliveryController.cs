using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class DeliveryController : ControllerBase
{
    private readonly IDeliveryService _deliveryService;

    public DeliveryController(IDeliveryService deliveryService)
    {
        _deliveryService = deliveryService;
    }

    [HttpPost]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> CreateDelivery([FromBody] DeliveryDto deliveryDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return BadRequest("User ID is required.");
        }

        deliveryDto.UserId = int.Parse(userId);
        var delivery = await _deliveryService.CreateDeliveryAsync(deliveryDto);
        return CreatedAtAction(nameof(GetDelivery), new { id = delivery.Id }, delivery);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<Delivery>> GetDelivery(int id)
    {
        var delivery = await _deliveryService.GetDeliveryAsync(id);
        if (delivery == null)
        {
            return NotFound();
        }
        return Ok(delivery);
    }

    [HttpGet]
    [Authorize(Roles = "Manager")]
    public async Task<ActionResult<IEnumerable<Delivery>>> GetAllDeliveries()
    {
        var deliveries = await _deliveryService.GetAllDeliveriesAsync();
        return Ok(deliveries);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> UpdateDelivery(int id, [FromBody] DeliveryDto deliveryDto)
    {
        var result = await _deliveryService.UpdateDeliveryAsync(id, deliveryDto);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpPost("{id}/book")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> BookDelivery(int id)
    {
        var result = await _deliveryService.BookDeliveryAsync(id);
        if (!result)
        {
            return BadRequest("Delivery cannot be booked.");
        }
        return NoContent();
    }

    [HttpPost("{id}/ship")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> MarkAsShipped(int id)
    {
        var result = await _deliveryService.MarkAsShippedAsync(id);
        if (!result)
        {
            return BadRequest("Delivery cannot be marked as shipped.");
        }
        return NoContent();
    }
}
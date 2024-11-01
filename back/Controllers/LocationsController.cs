using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

public class LocationsController : ControllerBase
{
    private readonly ILocationService _locationService;

    public LocationsController(ILocationService locationService)
    {
        _locationService = locationService;
    }

    [HttpPost("api/Location")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<Location>> CreateLocation([FromBody] LocationDto locationDto)
    {
        var location = await _locationService.CreateLocationAsync(locationDto);
        return CreatedAtAction(nameof(GetLocation), new { id = location.Id }, location);
    }

    [HttpGet("api/Location/{id}")]
    [Authorize(Roles = "User, Manager, Admin")]
    public async Task<ActionResult<Location>> GetLocation(int id)
    {
        var location = await _locationService.GetLocationAsync(id);
        if (location == null)
        {
            return NotFound();
        }
        return location;
    }

    [HttpGet]
    [Authorize(Roles = "User, Manager, Admin")]
    public async Task<ActionResult<IEnumerable<Location>>> GetAllLocations()
    {
        var locations = await _locationService.GetAllLocationsAsync();
        return Ok(locations);
    }

    [HttpGet("api/Locations")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<Location>>> GetAllLocationsForAdmin()
    {
        var locations = await _locationService.GetAllLocationsAsync();
        return Ok(locations);
    }
    [HttpDelete("api/Location/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteLocation(int id)
    {
        var location = await _locationService.GetLocationAsync(id);
        if (location == null)
        {
            return NotFound();
        }
        await _locationService.DeleteLocationAsync(location);
        return NoContent();
    }
}
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
    public async Task<ActionResult<Location>> CreateLocation([FromBody] CreateLocationDto createLocationDto)
    {
        var location = await _locationService.CreateLocationAsync(createLocationDto);
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

    [HttpGet("api/Locations")]
    [Authorize(Roles = "User, Manager, Admin")]
    public async Task<ActionResult<IEnumerable<LocationDto>>> GetAllLocations()
    {
        var locations = await _locationService.GetAllLocationsAsync();
        var locationDtos = locations.Select(location => new LocationDto
        {
            Id = location.Id,
            Name = location.Name
        }).ToList();

        return Ok(locationDtos);
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
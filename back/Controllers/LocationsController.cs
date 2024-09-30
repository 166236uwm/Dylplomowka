using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Warehouse.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LocationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/Locations
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Location>> CreateLocation(LocationDto locationDto)
        {
            var location = new Location
            {
                Name = locationDto.Name
            };

            _context.Locations.Add(location);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLocation), new { id = location.Id }, location);
        }

        // GET: api/Locations/5
        [HttpGet("{id}")]
        [Authorize(Roles = "User, Manager, Admin")]
        public async Task<ActionResult<Location>> GetLocation(int id)
        {
            var location = await _context.Locations.FindAsync(id);

            if (location == null)
            {
                return NotFound();
            }

            return location;
        }
    }
}
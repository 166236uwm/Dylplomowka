using Microsoft.EntityFrameworkCore;

public class LocationService : ILocationService
{
    private readonly ApplicationDbContext _context;

    public LocationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Location> CreateLocationAsync(LocationDto locationDto)
    {
        var location = new Location
        {
            Name = locationDto.Name
        };

        _context.Locations.Add(location);
        await _context.SaveChangesAsync();
        return location;
    }

    public async Task<Location> GetLocationAsync(int id)
    {
        var location = await _context.Locations.FindAsync(id);
        if (location == null)
        {
            throw new KeyNotFoundException($"Location with id {id} not found.");
        }
        return location;
    }

    public async Task<IEnumerable<Location>> GetAllLocationsAsync()
    {
        return await _context.Locations.ToListAsync();
    }
}
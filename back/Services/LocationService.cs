using Microsoft.EntityFrameworkCore;

public class LocationService : ILocationService
{
    private readonly ApplicationDbContext _context;

    public LocationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Location> CreateLocationAsync(CreateLocationDto createLocationDto)
    {
        var location = new Location
        {
            Name = createLocationDto.Name
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
    public async Task DeleteLocationAsync(Location location)
    {
        _context.Locations.Remove(location);
        await _context.SaveChangesAsync();
    }
    public async Task UpdateLocationAsync(Location location)
    {
        _context.Locations.Update(location);
        await _context.SaveChangesAsync();
    }
}
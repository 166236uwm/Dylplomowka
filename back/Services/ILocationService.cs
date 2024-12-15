public interface ILocationService
{
    Task<Location> CreateLocationAsync(CreateLocationDto createLocationDto);
    Task<Location> GetLocationAsync(int id);
    Task<IEnumerable<Location>> GetAllLocationsAsync();
    Task DeleteLocationAsync(Location location);
    Task UpdateLocationAsync(Location location);
}
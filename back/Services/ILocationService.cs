public interface ILocationService
{
    Task<Location> CreateLocationAsync(LocationDto locationDto);
    Task<Location> GetLocationAsync(int id);
    Task<IEnumerable<Location>> GetAllLocationsAsync();
}
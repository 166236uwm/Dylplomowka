public interface IInventoryCheckService
{
    Task<InventoryCheck> CreateInventoryCheckAsync(InventoryCheckDto checkDto);
    Task<InventoryCheck> GetInventoryCheckAsync(int id);
    Task<IEnumerable<InventoryCheck>> GetAllInventoryChecksAsync();
    Task UpdateInventoryCheckAsync(int id, InventoryCheckDto checkDto);
    Task DeleteInventoryCheckAsync(int id);
}
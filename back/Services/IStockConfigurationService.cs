public interface IStockConfigurationService
{
    Task<IEnumerable<StockConfiguration>> GetAllAsync();
    Task<StockConfiguration> GetByIdAsync(int id);
    Task<StockConfiguration> CreateAsync(StockConfigurationDto dto);
    Task<bool> UpdateAsync(int id, StockConfigurationDto dto);
    Task<bool> DeleteAsync(int id);
}
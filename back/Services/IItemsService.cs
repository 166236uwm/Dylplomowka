public interface IItemService
{
    Task<IEnumerable<ItemDto>> GetItemsAsync();
    Task<Item> GetItemAsync(int id);
    Task<Item> CreateItemAsync(Item item);
    Task UpdateItemAsync(int id, Item item);
    Task DeleteItemAsync(int id);
    Task<IEnumerable<object>> GetItemsGroupedByLocationAsync(); // New method
}

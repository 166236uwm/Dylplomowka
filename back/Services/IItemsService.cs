public interface IItemService
{
    Task<IEnumerable<ItemDto>> GetItemsAsync();
    Task<Item> GetItemAsync(int id);
    Task<ItemDto> CreateItemAsync(CreateItemDto createItemDto);
    Task UpdateItemAsync(int id, ItemDto itemDto);
    Task DeleteItemAsync(int id);
    Task<IEnumerable<object>> GetItemsGroupedByLocationAsync();
}

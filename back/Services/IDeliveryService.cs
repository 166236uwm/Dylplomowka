public interface IDeliveryService
{
    Task<Delivery> CreateDeliveryAsync(DeliveryDto deliveryDto);
    Task<Delivery> GetDeliveryAsync(int id);
    Task<IEnumerable<Delivery>> GetAllDeliveriesAsync();
    Task<bool> UpdateDeliveryAsync(int id, DeliveryDto deliveryDto);
    Task<bool> BookDeliveryAsync(int id);
    Task<bool> MarkAsShippedAsync(int id);
}
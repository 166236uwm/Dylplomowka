public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public DateTime CreatedAt { get; set; }

    // Właściwości nawigacyjne
    public ICollection<Delivery> Deliveries { get; set; }
    public ICollection<Shipment> Shipments { get; set; }
    public ICollection<InventoryCheck> InventoryChecks { get; set; }
}

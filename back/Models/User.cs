public class User
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public required string Email { get; set; }
    public required string Role { get; set; }
    public required string PasswordHash { get; set; }
    public DateTime CreatedAt { get; set; }

    // Właściwości nawigacyjne
    public ICollection<Delivery> Deliveries { get; set; } = new List<Delivery>();
    public ICollection<Shipment> Shipments { get; set; } = new List<Shipment>();
    public ICollection<InventoryCheck> InventoryChecks { get; set; } = new List<InventoryCheck>();
}

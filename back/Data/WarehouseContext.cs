using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Location> Locations { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<Delivery> Deliveries { get; set; }
    public DbSet<DeliveredItem> DeliveredItems { get; set; }
    public DbSet<Shipment> Shipments { get; set; }
    public DbSet<ShipmentItem> ShipmentItems { get; set; }
    public DbSet<InventoryCheck> InventoryChecks { get; set; }
    public DbSet<InventoryCheckItem> InventoryCheckItems { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<TransactionItem> TransactionItems { get; set; }
    public DbSet<StockConfiguration> StockConfigurations { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<DeliveredItem>()
            .HasKey(di => new { di.ItemId, di.DeliveryId });

        modelBuilder.Entity<ShipmentItem>()
            .HasKey(si => new { si.ItemId, si.ShipmentId });

        modelBuilder.Entity<InventoryCheckItem>()
            .HasKey(ici => new { ici.ItemId, ici.InventoryCheckId });

        modelBuilder.Entity<TransactionItem>()
            .HasKey(ti => new { ti.ItemId, ti.TransactionId }); 

        modelBuilder.Entity<Item>()
            .HasOne(i => i.Location)
            .WithMany(l => l.Items)
            .HasForeignKey(i => i.LocationId);

        modelBuilder.Entity<Delivery>()
            .HasOne(d => d.User)
            .WithMany(u => u.Deliveries)
            .HasForeignKey(d => d.UserId);

        modelBuilder.Entity<DeliveredItem>()
            .HasOne(di => di.Item)
            .WithMany(i => i.DeliveredItems)
            .HasForeignKey(di => di.ItemId);

        modelBuilder.Entity<DeliveredItem>()
            .HasOne(di => di.Delivery)
            .WithMany(d => d.DeliveredItems)
            .HasForeignKey(di => di.DeliveryId);

        modelBuilder.Entity<Shipment>()
            .HasOne(s => s.User)
            .WithMany(u => u.Shipments)
            .HasForeignKey(s => s.UserId);

        modelBuilder.Entity<ShipmentItem>()
            .HasOne(si => si.Item)
            .WithMany(i => i.ShipmentItems)
            .HasForeignKey(si => si.ItemId);

        modelBuilder.Entity<ShipmentItem>()
            .HasOne(si => si.Shipment)
            .WithMany(s => s.ShipmentItems)
            .HasForeignKey(si => si.ShipmentId);

        modelBuilder.Entity<InventoryCheck>()
            .HasOne(ic => ic.User)
            .WithMany(u => u.InventoryChecks)
            .HasForeignKey(ic => ic.UserId);

        modelBuilder.Entity<InventoryCheckItem>()
            .HasOne(ici => ici.Item)
            .WithMany(i => i.InventoryCheckItems)
            .HasForeignKey(ici => ici.ItemId);

        modelBuilder.Entity<InventoryCheckItem>()
            .HasOne(ici => ici.InventoryCheck)
            .WithMany(ic => ic.InventoryCheckItems)
            .HasForeignKey(ici => ici.InventoryCheckId);

        modelBuilder.Entity<TransactionItem>()
            .HasOne(ti => ti.Item)
            .WithMany(i => i.TransactionItems)
            .HasForeignKey(ti => ti.ItemId);

        modelBuilder.Entity<TransactionItem>()
            .HasOne(ti => ti.Transaction)
            .WithMany(t => t.TransactionItems)
            .HasForeignKey(ti => ti.TransactionId);
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Magazyn.Migrations
{
    /// <inheritdoc />
    public partial class AddRequiredStockToItem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "RequiredStock",
                table: "Items",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequiredStock",
                table: "Items");
        }
    }
}

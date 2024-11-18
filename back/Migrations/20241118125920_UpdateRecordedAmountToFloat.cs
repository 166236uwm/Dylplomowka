using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Magazyn.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRecordedAmountToFloat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "RecordedAmount",
                table: "InventoryCheckItems",
                type: "real",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "RecordedAmount",
                table: "InventoryCheckItems",
                type: "integer",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");
        }
    }
}

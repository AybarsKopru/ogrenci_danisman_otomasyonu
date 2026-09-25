using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentAdvisory.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvisorToStudent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AdvisorId",
                table: "Students",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Students_AdvisorId",
                table: "Students",
                column: "AdvisorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Advisors_AdvisorId",
                table: "Students",
                column: "AdvisorId",
                principalTable: "Advisors",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Advisors_AdvisorId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_AdvisorId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "AdvisorId",
                table: "Students");
        }
    }
}

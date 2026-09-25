using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentAdvisory.Domain.Entities;

namespace StudentAdvisory.Infrastructure.Data.Configurations;

public class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Title).IsRequired().HasMaxLength(200);
        builder.Property(x => x.Message).IsRequired().HasMaxLength(1000);

        // The UserId will link to ApplicationUser, but we don't necessarily 
        // need a hard FK constraint to the Identity table here if we want to keep domains separate, 
        // but since we are in a monolith, we can just enforce index.
        builder.HasIndex(x => x.UserId);
    }
}

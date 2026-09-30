using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentAdvisory.Domain.Entities;

namespace StudentAdvisory.Infrastructure.Data.Configurations;

public class MessageConfiguration : IEntityTypeConfiguration<Message>
{
    public void Configure(EntityTypeBuilder<Message> builder)
    {
        builder.HasKey(m => m.Id);

        builder.Property(m => m.SenderEmail).HasMaxLength(150).IsRequired();
        builder.Property(m => m.ReceiverEmail).HasMaxLength(150).IsRequired();
        builder.Property(m => m.Subject).HasMaxLength(200).IsRequired();
        builder.Property(m => m.Content).HasMaxLength(2000).IsRequired();

        builder.HasIndex(m => m.SenderId);
        builder.HasIndex(m => m.ReceiverId);
    }
}

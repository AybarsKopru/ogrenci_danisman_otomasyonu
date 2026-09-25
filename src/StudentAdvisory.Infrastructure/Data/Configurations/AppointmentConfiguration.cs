using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentAdvisory.Domain.Entities;

namespace StudentAdvisory.Infrastructure.Data.Configurations;

public class AppointmentConfiguration : IEntityTypeConfiguration<Appointment>
{
    public void Configure(EntityTypeBuilder<Appointment> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Status).IsRequired().HasMaxLength(20);
        builder.Property(x => x.Notes).HasMaxLength(500);

        builder.HasOne(x => x.Student)
               .WithMany()
               .HasForeignKey(x => x.StudentId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Advisor)
               .WithMany()
               .HasForeignKey(x => x.AdvisorId)
               .OnDelete(DeleteBehavior.Cascade);
    }
}

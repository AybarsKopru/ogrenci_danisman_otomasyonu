using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentAdvisory.Domain.Entities;

namespace StudentAdvisory.Infrastructure.Data.Configurations;

public class MeetingConfiguration : IEntityTypeConfiguration<Meeting>
{
    public void Configure(EntityTypeBuilder<Meeting> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.MeetingNotes).IsRequired();
        builder.Property(x => x.ActionItems).HasMaxLength(1000);

        builder.HasOne(x => x.Appointment)
               .WithMany()
               .HasForeignKey(x => x.AppointmentId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Student)
               .WithMany()
               .HasForeignKey(x => x.StudentId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Advisor)
               .WithMany()
               .HasForeignKey(x => x.AdvisorId)
               .OnDelete(DeleteBehavior.Restrict);
    }
}

using StudentAdvisory.Domain.Common;

namespace StudentAdvisory.Domain.Entities;

public class Appointment : BaseEntity
{
    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public Guid AdvisorId { get; set; }
    public Advisor? Advisor { get; set; }

    public DateTime AppointmentDate { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected, Completed
    public string Notes { get; set; } = string.Empty;
}

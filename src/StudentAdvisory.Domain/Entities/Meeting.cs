using StudentAdvisory.Domain.Common;

namespace StudentAdvisory.Domain.Entities;

public class Meeting : BaseEntity
{
    public Guid AppointmentId { get; set; }
    public Appointment? Appointment { get; set; }

    public Guid StudentId { get; set; }
    public Student? Student { get; set; }

    public Guid AdvisorId { get; set; }
    public Advisor? Advisor { get; set; }

    public DateTime MeetingDate { get; set; }
    public string MeetingNotes { get; set; } = string.Empty;
    public string ActionItems { get; set; } = string.Empty;
}

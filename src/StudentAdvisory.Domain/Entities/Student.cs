using StudentAdvisory.Domain.Common;

namespace StudentAdvisory.Domain.Entities;

public class Student : BaseEntity
{
    public string StudentNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid? DepartmentId { get; set; }
    public string Status { get; set; } = "Active"; // Active, Graduated, Suspended vb.
}

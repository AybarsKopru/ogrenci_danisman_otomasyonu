using StudentAdvisory.Domain.Common;

namespace StudentAdvisory.Domain.Entities;

public class Advisor : BaseEntity
{
    public string RegistrationNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Guid? DepartmentId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string OfficeLocation { get; set; } = string.Empty;
}

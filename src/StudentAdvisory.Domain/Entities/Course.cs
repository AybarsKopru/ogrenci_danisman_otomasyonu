using StudentAdvisory.Domain.Common;

namespace StudentAdvisory.Domain.Entities;

public class Course : BaseEntity
{
    public string Code { get; set; } = string.Empty;       // "MAT101"
    public string Name { get; set; } = string.Empty;       // "Matematik I"
    public int Credits { get; set; }                        // AKTS: 6
    public Guid StudentId { get; set; }
    public Student? Student { get; set; }
    public string Semester { get; set; } = string.Empty;   // "2024-Güz"
    public string? Grade { get; set; }                      // "AA", "BA", etc.
    public string Status { get; set; } = "Devam Ediyor";   // "Devam Ediyor", "Geçti", "Kaldı"
}

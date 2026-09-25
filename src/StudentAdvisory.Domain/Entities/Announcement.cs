using StudentAdvisory.Domain.Common;

namespace StudentAdvisory.Domain.Entities;

public class Announcement : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string TargetAudience { get; set; } = "All"; // All, Students, Advisors
    public DateTime PublishDate { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
}

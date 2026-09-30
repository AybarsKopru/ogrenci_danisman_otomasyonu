using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAdvisory.Infrastructure.Data;

namespace StudentAdvisory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReportsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("dashboard-stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var stats = new
        {
            TotalStudents = await _context.Students.CountAsync(),
            TotalAdvisors = await _context.Advisors.CountAsync(),
            PendingAppointments = await _context.Appointments.CountAsync(a => a.Status == "Pending"),
            ApprovedAppointments = await _context.Appointments.CountAsync(a => a.Status == "Approved"),
            CompletedAppointments = await _context.Appointments.CountAsync(a => a.Status == "Completed"),
            TotalMeetings = await _context.Meetings.CountAsync(),
            TotalAnnouncements = await _context.Announcements.CountAsync(a => a.IsActive),
            ActiveStudents = await _context.Students.CountAsync(s => s.Status == "Active"),
            GraduatedStudents = await _context.Students.CountAsync(s => s.Status == "Graduated"),
            SuspendedStudents = await _context.Students.CountAsync(s => s.Status == "Suspended")
        };

        return Ok(stats);
    }
}

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
        var studentCount = await _context.Students.CountAsync();
        var advisorCount = await _context.Advisors.CountAsync();
        var pendingAppointments = await _context.Appointments.CountAsync(a => a.Status == "Pending");

        return Ok(new
        {
            TotalStudents = studentCount,
            TotalAdvisors = advisorCount,
            PendingAppointments = pendingAppointments
        });
    }
}

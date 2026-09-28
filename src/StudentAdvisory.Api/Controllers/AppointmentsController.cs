using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAdvisory.Domain.Entities;
using StudentAdvisory.Domain.Entities.Identity;
using StudentAdvisory.Infrastructure.Data;

namespace StudentAdvisory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public AppointmentsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAppointments()
    {
        var appointments = await _context.Appointments
            .Include(a => a.Student)
            .Include(a => a.Advisor)
            .ToListAsync();
        return Ok(appointments);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAppointment(Appointment appointment)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user != null && User.IsInRole("Student"))
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.Email == user.Email);
            if (student != null)
            {
                appointment.StudentId = student.Id;
                if (student.AdvisorId.HasValue)
                {
                    appointment.AdvisorId = student.AdvisorId.Value;
                }
            }
        }

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();
        return Ok(appointment);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] string status)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null) return NotFound();

        appointment.Status = status;
        await _context.SaveChangesAsync();

        return Ok(appointment);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAppointment(Guid id)
    {
        var appointment = await _context.Appointments
            .Include(a => a.Student)
            .Include(a => a.Advisor)
            .FirstOrDefaultAsync(a => a.Id == id);
            
        if (appointment == null) return NotFound();
        return Ok(appointment);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAppointment(Guid id, Appointment appointment)
    {
        if (id != appointment.Id) return BadRequest();

        _context.Entry(appointment).State = EntityState.Modified;
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AppointmentExists(id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAppointment(Guid id)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null) return NotFound();

        _context.Appointments.Remove(appointment);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AppointmentExists(Guid id)
    {
        return _context.Appointments.Any(e => e.Id == id);
    }
}

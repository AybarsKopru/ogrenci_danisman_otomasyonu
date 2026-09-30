using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAdvisory.Domain.Entities;
using StudentAdvisory.Infrastructure.Data;

namespace StudentAdvisory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MeetingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MeetingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMeetings()
    {
        var meetings = await _context.Meetings
            .Include(m => m.Student)
            .Include(m => m.Advisor)
            .Include(m => m.Appointment)
            .ToListAsync();
        return Ok(meetings);
    }

    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetStudentMeetings(Guid studentId)
    {
        var meetings = await _context.Meetings
            .Include(m => m.Advisor)
            .Where(m => m.StudentId == studentId)
            .OrderByDescending(m => m.MeetingDate)
            .ToListAsync();

        return Ok(meetings);
    }

    [HttpPost]
    public async Task<IActionResult> CreateMeeting(Meeting meeting)
    {
        meeting.Id = Guid.NewGuid();
        _context.Meetings.Add(meeting);
        await _context.SaveChangesAsync();

        var createdMeeting = await _context.Meetings
            .Include(m => m.Advisor)
            .FirstOrDefaultAsync(m => m.Id == meeting.Id);

        return Ok(createdMeeting);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMeeting(Guid id, Meeting meeting)
    {
        if (id != meeting.Id) return BadRequest();

        _context.Entry(meeting).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!MeetingExists(id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMeeting(Guid id)
    {
        var meeting = await _context.Meetings.FindAsync(id);
        if (meeting == null) return NotFound();

        _context.Meetings.Remove(meeting);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool MeetingExists(Guid id)
    {
        return _context.Meetings.Any(e => e.Id == id);
    }
}

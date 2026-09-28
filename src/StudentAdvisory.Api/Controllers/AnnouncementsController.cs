using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAdvisory.Domain.Entities;
using StudentAdvisory.Infrastructure.Data;

namespace StudentAdvisory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnnouncementsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AnnouncementsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAnnouncements()
    {
        var announcements = await _context.Announcements
            .Where(a => a.IsActive)
            .OrderByDescending(a => a.PublishDate)
            .ToListAsync();
        return Ok(announcements);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAnnouncement(Announcement announcement)
    {
        _context.Announcements.Add(announcement);
        await _context.SaveChangesAsync();
        return Ok(announcement);
    }
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAnnouncement(Guid id)
    {
        var announcement = await _context.Announcements.FindAsync(id);
        if (announcement == null) return NotFound();
        return Ok(announcement);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAnnouncement(Guid id, Announcement announcement)
    {
        if (id != announcement.Id) return BadRequest();

        _context.Entry(announcement).State = EntityState.Modified;
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AnnouncementExists(id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAnnouncement(Guid id)
    {
        var announcement = await _context.Announcements.FindAsync(id);
        if (announcement == null) return NotFound();

        _context.Announcements.Remove(announcement);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AnnouncementExists(Guid id)
    {
        return _context.Announcements.Any(e => e.Id == id);
    }
}

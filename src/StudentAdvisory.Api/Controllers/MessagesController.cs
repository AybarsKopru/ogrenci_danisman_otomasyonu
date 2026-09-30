using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAdvisory.Domain.Entities;
using StudentAdvisory.Domain.Entities.Identity;
using StudentAdvisory.Infrastructure.Data;

namespace StudentAdvisory.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public MessagesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("inbox")]
    public async Task<IActionResult> GetInbox()
    {
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

        var messages = await _context.Messages
            .Where(m => m.ReceiverEmail == userEmail)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        return Ok(messages);
    }

    [HttpGet("sent")]
    public async Task<IActionResult> GetSent()
    {
        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        if (string.IsNullOrEmpty(userEmail)) return Unauthorized();

        var messages = await _context.Messages
            .Where(m => m.SenderEmail == userEmail)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] Message message)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user == null || user.Email == null) return Unauthorized();

        message.SenderId = user.Id;
        message.SenderEmail = user.Email;
        message.CreatedAt = DateTime.UtcNow;
        message.IsRead = false;

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return Ok(message);
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var message = await _context.Messages.FindAsync(id);
        if (message == null) return NotFound();

        var userEmail = User.FindFirstValue(ClaimTypes.Email);
        if (message.ReceiverEmail != userEmail) return Forbid();

        message.IsRead = true;
        message.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }
}

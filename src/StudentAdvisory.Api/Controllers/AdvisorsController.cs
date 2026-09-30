using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAdvisory.Domain.Entities;
using StudentAdvisory.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using StudentAdvisory.Domain.Entities.Identity;

namespace StudentAdvisory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdvisorsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdvisorsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetAdvisors()
    {
        var advisors = await _context.Advisors.ToListAsync();
        return Ok(advisors);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAdvisor(Guid id)
    {
        var advisor = await _context.Advisors.FindAsync(id);
        if (advisor == null) return NotFound();
        return Ok(advisor);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAdvisor(Advisor advisor)
    {
        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(advisor.Email);
        if (existingUser == null)
        {
            var newUser = new ApplicationUser { UserName = advisor.Email, Email = advisor.Email };
            var result = await _userManager.CreateAsync(newUser, "Advisor123!");
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(newUser, "Advisor");
            }
        }

        _context.Advisors.Add(advisor);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAdvisor), new { id = advisor.Id }, advisor);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAdvisor(Guid id, Advisor advisor)
    {
        if (id != advisor.Id) return BadRequest();

        _context.Entry(advisor).State = EntityState.Modified;
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!AdvisorExists(id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAdvisor(Guid id)
    {
        var advisor = await _context.Advisors.FindAsync(id);
        if (advisor == null) return NotFound();

        _context.Advisors.Remove(advisor);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool AdvisorExists(Guid id)
    {
        return _context.Advisors.Any(e => e.Id == id);
    }
}

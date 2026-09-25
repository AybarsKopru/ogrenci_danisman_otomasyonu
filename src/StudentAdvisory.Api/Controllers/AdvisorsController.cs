using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAdvisory.Domain.Entities;
using StudentAdvisory.Infrastructure.Data;

namespace StudentAdvisory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdvisorsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdvisorsController(ApplicationDbContext context)
    {
        _context = context;
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
        _context.Advisors.Add(advisor);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAdvisor), new { id = advisor.Id }, advisor);
    }
}

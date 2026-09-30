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
public class StudentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public StudentsController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetStudents()
    {
        var students = await _context.Students.ToListAsync();
        return Ok(students);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetStudent(Guid id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null) return NotFound();
        return Ok(student);
    }

    [HttpPost]
    public async Task<IActionResult> CreateStudent(Student student)
    {
        // Check if user already exists
        var existingUser = await _userManager.FindByEmailAsync(student.Email);
        if (existingUser == null)
        {
            var newUser = new ApplicationUser { UserName = student.Email, Email = student.Email };
            var result = await _userManager.CreateAsync(newUser, "Student123!");
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(newUser, "Student");
            }
        }

        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, student);
    }

    [HttpPost("{studentId}/assign-advisor/{advisorId}")]
    public async Task<IActionResult> AssignAdvisor(Guid studentId, Guid advisorId)
    {
        var student = await _context.Students.FindAsync(studentId);
        if (student == null) return NotFound("Student not found");

        var advisor = await _context.Advisors.FindAsync(advisorId);
        if (advisor == null) return NotFound("Advisor not found");

        student.AdvisorId = advisorId;
        await _context.SaveChangesAsync();

        return Ok(student);
    }
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStudent(Guid id, Student student)
    {
        if (id != student.Id) return BadRequest();

        _context.Entry(student).State = EntityState.Modified;
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!StudentExists(id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStudent(Guid id)
    {
        var student = await _context.Students.FindAsync(id);
        if (student == null) return NotFound();

        _context.Students.Remove(student);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool StudentExists(Guid id)
    {
        return _context.Students.Any(e => e.Id == id);
    }
}

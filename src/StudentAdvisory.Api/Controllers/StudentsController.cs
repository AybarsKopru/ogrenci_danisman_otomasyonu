using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAdvisory.Domain.Entities;
using StudentAdvisory.Infrastructure.Data;

namespace StudentAdvisory.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class StudentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StudentsController(ApplicationDbContext context)
    {
        _context = context;
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
}

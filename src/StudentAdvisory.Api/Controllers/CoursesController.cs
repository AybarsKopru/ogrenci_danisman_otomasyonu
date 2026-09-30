using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentAdvisory.Domain.Entities;
using StudentAdvisory.Infrastructure.Data;

namespace StudentAdvisory.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CoursesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var courses = await _context.Courses
            .Include(c => c.Student)
            .ToListAsync();
        return Ok(courses);
    }

    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetByStudent(Guid studentId)
    {
        var courses = await _context.Courses
            .Where(c => c.StudentId == studentId)
            .OrderByDescending(c => c.Semester)
            .ToListAsync();
        return Ok(courses);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Course course)
    {
        course.CreatedAt = DateTime.UtcNow;
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), new { id = course.Id }, course);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Course course)
    {
        if (id != course.Id)
            return BadRequest();

        var existingCourse = await _context.Courses.FindAsync(id);
        if (existingCourse == null)
            return NotFound();

        existingCourse.Code = course.Code;
        existingCourse.Name = course.Name;
        existingCourse.Credits = course.Credits;
        existingCourse.StudentId = course.StudentId;
        existingCourse.Semester = course.Semester;
        existingCourse.Grade = course.Grade;
        existingCourse.Status = course.Status;
        existingCourse.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
            return NotFound();

        _context.Courses.Remove(course);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

using Microsoft.AspNetCore.Mvc.Filters;
using StudentAdvisory.Domain.Entities;
using StudentAdvisory.Infrastructure.Data;
using System.Security.Claims;

namespace StudentAdvisory.Api.Filters;

public class AuditLogFilterAttribute : IAsyncActionFilter
{
    private readonly ApplicationDbContext _context;

    public AuditLogFilterAttribute(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        // Execute the action first
        var resultContext = await next();

        // Only log POST, PUT, DELETE
        var method = context.HttpContext.Request.Method;
        if (method == "POST" || method == "PUT" || method == "DELETE")
        {
            var userEmail = context.HttpContext.User?.FindFirstValue(ClaimTypes.Email) ?? "Sistem";
            var path = context.HttpContext.Request.Path;
            var actionName = $"{method} {path}";
            var statusCode = context.HttpContext.Response.StatusCode;

            var log = new AuditLog
            {
                Action = actionName,
                Details = $"İşlem Sonucu HTTP {statusCode}",
                PerformedBy = userEmail,
                Timestamp = DateTime.UtcNow
            };

            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();
        }
    }
}

using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using StudentAdvisory.Domain.Entities.Identity;
using StudentAdvisory.Domain.Entities;

namespace StudentAdvisory.Infrastructure.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        string[] roles = { "Admin", "Advisor", "Student" };

        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
        }

        // Create Admin
        if (await userManager.FindByEmailAsync("admin@uni.edu.tr") == null)
        {
            var admin = new ApplicationUser { UserName = "admin@uni.edu.tr", Email = "admin@uni.edu.tr" };
            await userManager.CreateAsync(admin, "Admin123!");
            await userManager.AddToRoleAsync(admin, "Admin");
        }

        // Create Advisor
        ApplicationUser? advisorUser = await userManager.FindByEmailAsync("danisman@uni.edu.tr");
        if (advisorUser == null)
        {
            advisorUser = new ApplicationUser { UserName = "danisman@uni.edu.tr", Email = "danisman@uni.edu.tr" };
            await userManager.CreateAsync(advisorUser, "Advisor123!");
            await userManager.AddToRoleAsync(advisorUser, "Advisor");
            
            if (!dbContext.Advisors.Any(a => a.Email == "danisman@uni.edu.tr"))
            {
                dbContext.Advisors.Add(new Advisor
                {
                    Email = "danisman@uni.edu.tr",
                    FirstName = "Ahmet",
                    LastName = "Yılmaz",
                    RegistrationNumber = "ADV-001",
                    Title = "Prof. Dr.",
                    OfficeLocation = "A Blok 101"
                });
                await dbContext.SaveChangesAsync();
            }
        }

        var advisor = dbContext.Advisors.FirstOrDefault();

        // Create More Students
        var mockStudents = new[]
        {
            new { Email = "ogrenci@uni.edu.tr", FName = "Ali", LName = "Çalışkan", No = "20240001", Status = "Active" },
            new { Email = "ayse@uni.edu.tr", FName = "Ayşe", LName = "Demir", No = "20240002", Status = "Active" },
            new { Email = "mehmet@uni.edu.tr", FName = "Mehmet", LName = "Kaya", No = "20240003", Status = "Graduated" }
        };

        foreach (var s in mockStudents)
        {
            if (await userManager.FindByEmailAsync(s.Email) == null)
            {
                var user = new ApplicationUser { UserName = s.Email, Email = s.Email };
                await userManager.CreateAsync(user, "Student123!");
                await userManager.AddToRoleAsync(user, "Student");

                if (!dbContext.Students.Any(x => x.Email == s.Email))
                {
                    var student = new Student
                    {
                        Email = s.Email,
                        FirstName = s.FName,
                        LastName = s.LName,
                        StudentNumber = s.No,
                        AdvisorId = advisor?.Id,
                        Status = s.Status
                    };
                    dbContext.Students.Add(student);
                    await dbContext.SaveChangesAsync();

                    if (advisor != null && s.Email == "ogrenci@uni.edu.tr")
                    {
                        dbContext.Appointments.Add(new Appointment
                        {
                            StudentId = student.Id,
                            AdvisorId = advisor.Id,
                            AppointmentDate = DateTime.UtcNow.AddDays(1),
                            Status = "Pending",
                            Notes = "Ders seçimi hakkında görüşmek istiyorum."
                        });
                        dbContext.Appointments.Add(new Appointment
                        {
                            StudentId = student.Id,
                            AdvisorId = advisor.Id,
                            AppointmentDate = DateTime.UtcNow.AddDays(-2),
                            Status = "Approved",
                            Notes = "Geçmiş staj onayı toplantısı."
                        });
                        await dbContext.SaveChangesAsync();
                    }
                }
            }
        }
    }
}

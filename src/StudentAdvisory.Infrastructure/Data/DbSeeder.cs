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
                    LastName = "Hoca",
                    RegistrationNumber = "ADV-001",
                    Title = "Prof. Dr.",
                    OfficeLocation = "A Blok 101"
                });
                await dbContext.SaveChangesAsync();
            }
        }

        // Create Student
        ApplicationUser? studentUser = await userManager.FindByEmailAsync("ogrenci@uni.edu.tr");
        if (studentUser == null)
        {
            studentUser = new ApplicationUser { UserName = "ogrenci@uni.edu.tr", Email = "ogrenci@uni.edu.tr" };
            await userManager.CreateAsync(studentUser, "Student123!");
            await userManager.AddToRoleAsync(studentUser, "Student");

            if (!dbContext.Students.Any(s => s.Email == "ogrenci@uni.edu.tr"))
            {
                var advisor = dbContext.Advisors.FirstOrDefault();
                var student = new Student
                {
                    Email = "ogrenci@uni.edu.tr",
                    FirstName = "Ali",
                    LastName = "Çalışkan",
                    StudentNumber = "20240001",
                    AdvisorId = advisor?.Id
                };
                dbContext.Students.Add(student);
                await dbContext.SaveChangesAsync();

                if (advisor != null)
                {
                    dbContext.Appointments.Add(new Appointment
                    {
                        StudentId = student.Id,
                        AdvisorId = advisor.Id,
                        AppointmentDate = DateTime.UtcNow.AddDays(1),
                        Status = "Pending",
                        Notes = "Ders seçimi hakkında görüşmek istiyorum."
                    });
                    await dbContext.SaveChangesAsync();
                }
            }
        }
    }
}

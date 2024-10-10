using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Add this line
using System.Security.Claims; // Add this line
using Microsoft.IdentityModel.Tokens; // Add this using directive
using System.Text; // Add this using directive
using System.IdentityModel.Tokens.Jwt; // Add this line

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public UserService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<IActionResult> Register(UserRegistrationDto registrationDto)
    {
        if (await _context.Users.AnyAsync(u => u.Username == registrationDto.Username))
        {
            return new BadRequestObjectResult("Username already exists");
        }

        var user = new User
        {
            Username = registrationDto.Username,
            Name = registrationDto.Name,
            Surname = registrationDto.Surname,
            Email = registrationDto.Email,
            Role = "User",
            CreatedAt = DateTime.UtcNow,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new OkObjectResult("User registered successfully");
    }

    public async Task<IActionResult> Login(UserLoginDto loginDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return new UnauthorizedObjectResult("Invalid username or password");
        }

        var token = GenerateJwtToken(user);
        return new OkObjectResult(new { Token = token, Role = user.Role, Username = user.Username });
    }

    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
    {
        var users = await _context.Users
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Name = u.Name,
                Surname = u.Surname,
                Email = u.Email,
                Role = u.Role
            })
            .ToListAsync();

        return new OkObjectResult(users);
    }

    public async Task<IActionResult> UpdateUserRole(int id, string newRole)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return new NotFoundResult();
        }

        user.Role = newRole;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UserExists(id))
            {
                return new NotFoundResult();
            }
            else
            {
                throw;
            }
        }

        return new OkObjectResult(new { role = newRole });
    }

    private bool UserExists(int id)
    {
        return _context.Users.Any(e => e.Id == id);
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured")));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
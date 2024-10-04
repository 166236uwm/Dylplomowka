using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public UserController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegistrationDto registrationDto)
    {
        if (await _context.Users.AnyAsync(u => u.Username == registrationDto.Username))
        {
            return BadRequest("Username already exists");
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

        return Ok("User registered successfully");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto loginDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == loginDto.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid username or password");
        }

        var token = GenerateJwtToken(user);
        return Ok(new { Token = token, Role = user.Role });
    }
    [HttpGet]
    [Authorize(Roles = "Admin")]
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

        return Ok(users);
    }
    [HttpPut("{id}/role")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUserRole(int id, [FromBody] string newRole)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound();
        }

        // You might want to add validation here to ensure newRole is a valid role
        user.Role = newRole;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!UserExists(id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
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

public class UserRegistrationDto
{
    public required string Username { get; set; }
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class UserLoginDto
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}
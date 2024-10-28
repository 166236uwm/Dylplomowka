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
    private readonly IUserService _userService;
    private readonly ApplicationDbContext _context; // Add this line

    public UserController(IUserService userService, ApplicationDbContext context) // Modify constructor
    {
        _userService = userService;
        _context = context; // Assign the context
    }

    [HttpPost("register")]
    public Task<IActionResult> Register(UserRegistrationDto registrationDto)
    {
        return _userService.Register(registrationDto);
    }

    [HttpPost("login")]
    public Task<IActionResult> Login(UserLoginDto loginDto)
    {
        return _userService.Login(loginDto);
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
    {
        return _userService.GetAllUsers();
    }

    [HttpPut("{id}/role")]
    [Authorize(Roles = "Admin")]
    public Task<IActionResult> UpdateUserRole(int id, [FromBody] string newRole)
    {
        return _userService.UpdateUserRole(id, newRole);
    }
    
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound();
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

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

    public UserController(IUserService userService)
    {
        _userService = userService;
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
}

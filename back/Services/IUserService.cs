using Microsoft.AspNetCore.Mvc;

public interface IUserService
{
    Task<IActionResult> Register(UserRegistrationDto registrationDto);
    Task<IActionResult> Login(UserLoginDto loginDto);
    Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers();
    Task<IActionResult> UpdateUserRole(int id, string newRole);
}
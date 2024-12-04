using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class StockConfigurationController : ControllerBase
{
    private readonly IStockConfigurationService _stockConfigurationService;

    public StockConfigurationController(IStockConfigurationService stockConfigurationService)
    {
        _stockConfigurationService = stockConfigurationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetStockConfigurations()
    {
        var configurations = await _stockConfigurationService.GetAllAsync();
        return Ok(configurations);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetStockConfiguration(int id)
    {
        var configuration = await _stockConfigurationService.GetByIdAsync(id);
        if (configuration == null)
        {
            return NotFound();
        }
        return Ok(configuration);
    }

    [HttpPost]
    public async Task<IActionResult> CreateStockConfiguration([FromBody] StockConfigurationDto dto)
    {
        var configuration = await _stockConfigurationService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetStockConfiguration), new { id = configuration.Id }, configuration);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateStockConfiguration(int id, [FromBody] StockConfigurationDto dto)
    {
        var updated = await _stockConfigurationService.UpdateAsync(id, dto);
        if (!updated)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteStockConfiguration(int id)
    {
        var deleted = await _stockConfigurationService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound();
        }
        return NoContent();
    }
}
using Microsoft.AspNetCore.Mvc;

namespace brandup_ui_app_example.Controllers
{
    [Route("send")]
    public class SendController : Controller
    {
        [HttpPost, AutoValidateAntiforgeryToken]
        public IActionResult OnPost()
        {
            return Ok("test");
        }
    }
}
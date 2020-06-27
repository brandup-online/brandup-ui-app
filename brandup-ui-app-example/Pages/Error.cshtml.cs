using BrandUp.Website.Pages;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace brandup_ui_app_example.Pages
{
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public class ErrorModel : AppPageModel
    {
        public override string Title => "Error page";

        public string RequestId { get; set; }
        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);

        public void OnGet()
        {
            RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier;
        }
    }
}
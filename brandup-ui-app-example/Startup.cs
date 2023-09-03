using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace brandup_ui_app_example
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            #region ASP.NET

            services.AddRazorPages();

            services
                .AddResponseCompression(options =>
                {
                    options.EnableForHttps = true;
                    options.Providers.Add<Microsoft.AspNetCore.ResponseCompression.BrotliCompressionProvider>();
                    options.Providers.Add<Microsoft.AspNetCore.ResponseCompression.GzipCompressionProvider>();

                    options.MimeTypes = new string[] { "text/html", "text/xml", "text/json", "text/plain", "application/json", "application/xml", "application/javascript", "text/css" };
                })
                .Configure<Microsoft.AspNetCore.ResponseCompression.BrotliCompressionProviderOptions>(options =>
                {
                    options.Level = System.IO.Compression.CompressionLevel.Fastest;
                })
                .Configure<Microsoft.AspNetCore.ResponseCompression.GzipCompressionProviderOptions>(options =>
                {
                    options.Level = System.IO.Compression.CompressionLevel.Fastest;
                });

            services.AddResponseCaching();

            services.Configure<Microsoft.Extensions.WebEncoders.WebEncoderOptions>(options =>
            {
                options.TextEncoderSettings = new System.Text.Encodings.Web.TextEncoderSettings(System.Text.Unicode.UnicodeRanges.All);
            });

            services.Configure<Microsoft.AspNetCore.Routing.RouteOptions>(options =>
            {
                options.LowercaseUrls = true;
                options.AppendTrailingSlash = false;
                options.LowercaseQueryStrings = true;
            });

            services.AddRequestLocalization(options =>
            {
                var defaultCulture = new System.Globalization.CultureInfo("en");
                var supportedCultures = new[] { defaultCulture, new System.Globalization.CultureInfo("ru") };

                options.DefaultRequestCulture = new Microsoft.AspNetCore.Localization.RequestCulture(defaultCulture);
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;
            });

            services.Configure<IISServerOptions>(options => options.AllowSynchronousIO = true);

            #endregion
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();
            else
                app.UseHsts();

            app.UseRequestLocalization();
            app.UseResponseCompression();
            app.UseResponseCaching();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapControllers();
            });
        }
    }
}
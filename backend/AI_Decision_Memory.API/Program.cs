using AI_Decision_Memory.Application;
using AI_Decision_Memory.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add OpenApi
builder.Services.AddOpenApi();

// Register Clean Architecture Services
builder.Services.AddSingleton<IDecisionRepository, InMemoryDecisionRepository>();
builder.Services.AddTransient<ISimulatedDecisionAI, SimulatedDecisionAIService>();
// Setup CORS to allow requests from local dev and deployed frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowFrontend");

app.UseAuthorization();

// Map MVC Controllers
app.MapControllers();

app.Run();

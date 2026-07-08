# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy all project files individually to leverage Docker layer caching
COPY backend/AI_Decision_Memory.Domain/AI_Decision_Memory.Domain.csproj backend/AI_Decision_Memory.Domain/
COPY backend/AI_Decision_Memory.Application/AI_Decision_Memory.Application.csproj backend/AI_Decision_Memory.Application/
COPY backend/AI_Decision_Memory.Infrastructure/AI_Decision_Memory.Infrastructure.csproj backend/AI_Decision_Memory.Infrastructure/
COPY backend/AI_Decision_Memory.API/AI_Decision_Memory.API.csproj backend/AI_Decision_Memory.API/

# Restore dependencies
RUN dotnet restore backend/AI_Decision_Memory.API/AI_Decision_Memory.API.csproj

# Copy the rest of the C# backend source code
COPY backend/ backend/

# Publish Release output
RUN dotnet publish backend/AI_Decision_Memory.API/AI_Decision_Memory.API.csproj -c Release -o /app/publish

# Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Render assigns a port via PORT environment variable (exposed automatically or default to 10000)
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "AI_Decision_Memory.API.dll"]

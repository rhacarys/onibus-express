# Build
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src
COPY OnibusExpress.Api/*.csproj ./OnibusExpress.Api/
RUN dotnet restore ./OnibusExpress.Api/OnibusExpress.Api.csproj
COPY OnibusExpress.Api/ ./OnibusExpress.Api/
RUN dotnet publish ./OnibusExpress.Api/OnibusExpress.Api.csproj -c Release -o /app/publish

# Publish
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 5000
ENTRYPOINT ["dotnet", "OnibusExpress.Api.dll"]
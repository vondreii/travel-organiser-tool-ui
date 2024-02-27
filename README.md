# travel-organiser-tool-ui

This is to practice/upskill in Angular, C# .Net Entity Framework and SQL together.

## Purpose:

- View upcoming trips
- Can drill down and view details about each trip (WIP)
- Add/edit/delete trips (WIP)

## To run:

- Open **TravelOrganiserToolAngular** project, and run **ng serve** in the UI (localhost:4200)
- Open **TravelOrganiserTool** project using Visual Studio 2022. Use **dotnet run** or press play so it will run in the backend (localhost:5104) and listen to requests from the UI. When asked about SSL certificates, say 'Yes' on first screen, then 'No' on second screen.
- Run them at the same time. Both applications can't be run on the same port, so there is a CORS policy to allows request from 4200 to the different port, 5104.

## Database:

- Open SQL Server and use the SQLQuery.sql file.

## To update the DB:

- Open Visual Studio 2022
- Seed data and table model is created in **ApplicationDbContext.cs**.
- After updating the code, run **dotnet ef migrations add initialCreate<newNo>**, then **dotnet ef database update**.

## Current TODOs:

- Each div/card should open on a new page and display all the other details. (eg, date). Should be able to edit the details.
- Should be able to delete the trip
- Multiple members, and login details. A new member table and sessions.
- More details for each trip, such as hotel, and things to do.
- Can view the Itinerary for each day.
- Can have a wishlist of future trips.
- And keep track of finances.

## Structure:
- Dashboard
- Browse
  - Filter Locations
    - Region
    - Country
    - Climate
    - Tropical
    - Chilly
    - Highlands
    - Rural
    - Cities
- My Trips
- Wishlist
- Login/Logout
- Settings

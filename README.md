# travel-organiser-tool-ui

This is to practice/upskill in Angular, C# .Net Entity Framework and SQL together.

## Purpose:

- View upcoming trips
- Can drill down and view details about each trip (WIP)
- Add/edit/delete trips (WIP)

## How to run UI (hosted on Azure):
- Visit **https://travelorganiser.azurewebsites.net/** 
  
## How to run UI (locally):
- Open **travel-organiser-tool-ui** in Visual Code.
    - Open `global.service.ts` and change `isProduction` to false.
    - Run `ng serve` in the command line.
    - Visit it on
- Run both **travel-organiser-tool-web-server** and **travel-organiser-tool-ui** applications at the same time.
    - Both applications can't be run on the same port, so there is a CORS policy to allows request from 4200 to the different port, 5000.

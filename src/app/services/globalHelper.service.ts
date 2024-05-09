import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalHelperService {
  isProduction: boolean = true;

  constructor() { }

  getServerURL() {
    return this.isProduction ? 
      "https://travel-organiser-tool-web-server.azurewebsites.net" :
      "http://localhost:5000";
  }

  convertDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  convertDateForUI(date: Date): string {
    const year = date.getFullYear();
    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = monthNames[date.getMonth()]
    const day = ('0' + date.getDate()).slice(-2);

    return year === new Date().getFullYear() ?
      `${day} ${month}` :
      `${day} ${month} ${year}`
  }

  // Convert to readable date

  convertToDateISOString(dateString: string): string {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString();
  }
}

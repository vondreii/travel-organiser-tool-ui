import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  isDialogOpen = false;

  constructor() { }
}

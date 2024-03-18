import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  isProduction: boolean = true;

  constructor() { }
}

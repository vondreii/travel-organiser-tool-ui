import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'yesNoDialog',
  templateUrl: './yesNoDialog.component.html'
})
export class YesNoDialogComponent implements OnInit {

  @Input() dialogTitle: string;
  @Input() dialogMessage: string;

  @Output()
  yesSelected = new EventEmitter();
  
  @Output()
  noSelected = new EventEmitter();

  constructor() { 
    this.dialogTitle = '';
    this.dialogMessage = '';
  }

  ngOnInit(): void {
  }

}

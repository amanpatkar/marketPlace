import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent {
  message:string = '';

  constructor(private dialogue:MatDialog, @Inject(MAT_DIALOG_DATA) public data:any) {}

}

import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
  context = input.required<string>()
  confirm = output<boolean>()
  cancel = output<boolean>()


  selectionConfirm(){
    this.confirm.emit(true)
  }

  selectionCancel(){
    this.cancel.emit(true)
  }
}

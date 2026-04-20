import { Component, input, OnInit, output, signal } from '@angular/core';

@Component({
  selector: 'app-error-message-dialog',
  imports: [],
  templateUrl: './error-message-dialog.html',
  styleUrl: './error-message-dialog.scss',
})
export class ErrorMessageDialog implements OnInit {
  errorMessage = input.required<string>()
  isErrorMessageDismissed = output<boolean>()
  isShown = signal<boolean>(true)

  

  ngOnInit(): void {
    this.isShown.set(true)
    setTimeout(() => {
      this.isShown.set(false)
      this.dismissMessage()
    }, 3000)
  }

  dismissMessage(){
    this.isErrorMessageDismissed.emit(!this.isShown())
  }


}

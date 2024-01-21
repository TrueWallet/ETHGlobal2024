import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AsyncPipe, NgIf } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-loading-button',
  standalone: true,
  imports: [
    MatButton,
    NgIf,
    MatProgressSpinner
  ],
  templateUrl: './loading-button.component.html',
  styleUrl: './loading-button.component.scss'
})
export class LoadingButtonComponent {
  @Input() disabled: boolean = false;
  @Input() loading: boolean | null = null;
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();
}

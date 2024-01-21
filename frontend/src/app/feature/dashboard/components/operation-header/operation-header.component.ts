import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-operation-header',
  standalone: true,
  imports: [],
  templateUrl: './operation-header.component.html',
  styleUrl: './operation-header.component.scss'
})
export class OperationHeaderComponent {
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  close(): void {
    this.onClose.emit();
  }
}

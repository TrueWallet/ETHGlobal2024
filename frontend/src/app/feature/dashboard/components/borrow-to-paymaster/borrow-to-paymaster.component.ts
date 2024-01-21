import { Component, Inject } from '@angular/core';
import { MatFormField, MatHint, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BorrowService } from "../../services/borrow/borrow.service";
import { FormsModule } from "@angular/forms";
import { BehaviorSubject, finalize, from } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { Addresses } from "../../../../core/configs";
import { LoadingButtonComponent } from "../../../../core/components/loading-button/loading-button.component";

@Component({
  selector: 'app-borrow-to-paymaster',
  standalone: true,
  imports: [
    MatLabel,
    MatInput,
    MatFormField,
    MatSuffix,
    FormsModule,
    AsyncPipe,
    MatHint,
    LoadingButtonComponent,
  ],
  templateUrl: './borrow-to-paymaster.component.html',
  styleUrl: './borrow-to-paymaster.component.scss'
})
export class BorrowToPaymasterComponent {
  amount: string = '';
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) private address: string,
    private ref: MatDialogRef<BorrowToPaymasterComponent>,
    private service: BorrowService,
  ) {
  }

  borrow(): void {
    this.loading$.next(true);

    this.service.approveDelegation(this.address, this.amount, Addresses.GHO).pipe(
      finalize(() => this.loading$.next(false)),
    ).subscribe(() => {
        this.ref.close();
      })
  }
}

import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { ERC20Token } from "../../interfaces";
import { MatButtonModule } from "@angular/material/button";
import { OperationHeaderComponent } from "../operation-header/operation-header.component";
import { BorrowService } from "../../services/borrow/borrow.service";
import { BehaviorSubject, finalize, from, map, Observable, of, switchMap } from "rxjs";
import { AsyncPipe, DecimalPipe, JsonPipe, NgIf } from "@angular/common";
import { MatFormField, MatHint, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { LoadingButtonComponent } from "../../../../core/components/loading-button/loading-button.component";
import { NotificationComponent } from "../../../../core/components/notification/notification.component";
import { DepositService } from "../../services/deposit/deposit.service";

@Component({
  selector: 'app-erc20-borrow',
  standalone: true,
  imports: [
    MatButtonModule,
    OperationHeaderComponent,
    AsyncPipe,
    JsonPipe,
    DecimalPipe,
    NgIf,
    MatFormField,
    MatInput,
    MatSuffix,
    MatLabel,
    MatHint,
    FormsModule,
    LoadingButtonComponent,
    NotificationComponent
  ],
  templateUrl: './erc20-borrow.component.html',
  styleUrl: './erc20-borrow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Erc20BorrowComponent {
  token: ERC20Token;

  refresh$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  canBorrow$: Observable<boolean>;

  borrowAmount: string = '';

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: ERC20Token,
    private ref: MatBottomSheetRef<Erc20BorrowComponent>,
    private borrowService: BorrowService,
    private deposit: DepositService,
  ) {
    this.token = data;
    this.canBorrow$ = this.refresh$.pipe(
      switchMap(() => from(this.deposit.getDepositedAmount())),
      map(amount => Number(amount) > 0),
    );
  }

  borrow(): void {
    this.loading$.next(true);
    this.borrowService.borrowERC20(this.token, this.borrowAmount).pipe(
      finalize(() => this.loading$.next(false)),
    ).subscribe((res) => {
      this.refresh$.next();
    });
  }

  close(): void {
    this.ref.dismiss();
  }
}

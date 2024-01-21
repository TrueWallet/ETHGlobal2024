import { Component, Inject } from '@angular/core';
import { OperationHeaderComponent } from "../operation-header/operation-header.component";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { AsyncPipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButton } from "@angular/material/button";
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatFormField, MatHint, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { WalletService } from "../../../../core/services/wallet/wallet.service";
import { BehaviorSubject, finalize } from "rxjs";
import { ERC20Token } from "../../interfaces";
import { DepositService } from "../../services/deposit/deposit.service";
import { LoadingButtonComponent } from "../../../../core/components/loading-button/loading-button.component";

@Component({
  selector: 'app-asset-deposit',
  standalone: true,
  imports: [
    OperationHeaderComponent,
    AsyncPipe,
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatFormField,
    MatHint,
    MatInput,
    MatLabel,
    MatSuffix,
    LoadingButtonComponent
  ],
  templateUrl: './asset-deposit.component.html',
  styleUrl: './asset-deposit.component.scss'
})
export class AssetDepositComponent {
  refresh$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);
  nativeBalance$: Promise<string>;
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  depositAmount: string = '';

  constructor(
    private ref: MatBottomSheetRef<AssetDepositComponent>,
    private wallet: WalletService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public token: ERC20Token,
    private depositService: DepositService,
  ) {
    this.nativeBalance$ = this.wallet.getBalance();
  }

  async deposit(): Promise<void> {
    this.loading$.next(true);
    this.depositService.deposit(this.token, this.depositAmount).pipe(
      finalize(() => this.loading$.next(false)),
    ).subscribe(() => {
      this.refresh$.next();
    });
  }

  close(): void {
    this.ref.dismiss()
  }
}

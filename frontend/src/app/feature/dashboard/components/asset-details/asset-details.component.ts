import { Component, Inject } from '@angular/core';
import { ERC20TokenWithBalance } from "../../interfaces";
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from "@angular/material/dialog";
import { AssetOperationsComponent } from "../asset-operations/asset-operations.component";
import { AsyncPipe, DecimalPipe, NgForOf, NgIf } from "@angular/common";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { OperationHeaderComponent } from "../operation-header/operation-header.component";
import { BehaviorSubject, from, Observable, switchMap } from "rxjs";
import { WalletService } from "../../../../core/services/wallet/wallet.service";

@Component({
  selector: 'app-asset-details',
  standalone: true,
  imports: [
    AssetOperationsComponent,
    AsyncPipe,
    MatDialogClose,
    DecimalPipe,
    MatTabGroup,
    MatTab,
    NgIf,
    NgForOf,
    OperationHeaderComponent
  ],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.scss'
})
export class AssetDetailsComponent {
  private refresh$: BehaviorSubject<void> = new BehaviorSubject<void>(void 0);
  balance$: Observable<string>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public token: ERC20TokenWithBalance,
    private ref: MatDialogRef<AssetDetailsComponent>,
    private wallet: WalletService,
  ) {
    this.balance$ = this.refresh$.pipe(
      switchMap(() => this.wallet.sdk.getERC20Balance(token.address)),
    );
  }

  refreshData(): void {
    this.refresh$.next();
  }

  close(): void {
    this.ref.close();
  }
}

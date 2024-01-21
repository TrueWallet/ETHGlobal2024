import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { ERC20Token, ERC20TokenWithBalance } from "../../interfaces";
import { AsyncPipe, DecimalPipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { MatFormField, MatHint, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { WalletService } from "../../../../core/services/wallet/wallet.service";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Erc20ManagerService } from "../../services/erc20-manager/erc20-manager.service";
import { BehaviorSubject, finalize } from "rxjs";
import { OperationHeaderComponent } from "../operation-header/operation-header.component";
import { MatOption, MatSelect } from "@angular/material/select";
import { Paymasters } from "../../../../core/configs";
import { LoadingButtonComponent } from "../../../../core/components/loading-button/loading-button.component";

@Component({
  selector: 'app-asset-send',
  standalone: true,
  imports: [
    JsonPipe,
    MatFormField,
    MatInput,
    MatHint,
    MatLabel,
    AsyncPipe,
    DecimalPipe,
    MatSuffix,
    ReactiveFormsModule,
    NgIf,
    OperationHeaderComponent,
    MatSelect,
    MatOption,
    NgForOf,
    LoadingButtonComponent,
  ],
  templateUrl: './asset-send.component.html',
  styleUrl: './asset-send.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetSendComponent {
  token: ERC20TokenWithBalance | null;
  balance$: Promise<string>;

  form: FormGroup;

  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  paymasters: any[] = [
    {
      title: 'Without Paymaster',
      address: Paymasters.EMPTY,
    },
    {
      title: 'GHO Paymaster',
      address: Paymasters.GHO,
    },
    {
      title: 'Dummy Paymaster',
      address: Paymasters.DUMMY,
    }
  ]

  constructor(
    private ref: MatBottomSheetRef<AssetSendComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) token: ERC20TokenWithBalance | undefined,
    private wallet: WalletService,
    private service: Erc20ManagerService,
  ) {
    this.token = token || null;
    this.balance$ = token?.balance || this.wallet.getBalance();

    this.form = new FormGroup({
      address: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      paymaster: new FormControl(Paymasters.EMPTY),
    });
  }

  send(): void {
    this.loading$.next(true);
    this.service.sendAsset(this.token, this.form.value).pipe(
      finalize(() => this.loading$.next(false)),
    ).subscribe();
  }

  close(): void {
    this.ref.dismiss();
  }
}

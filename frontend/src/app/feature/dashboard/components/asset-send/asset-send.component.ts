import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { ERC20Token, ERC20TokenWithBalance } from "../../interfaces";
import { AsyncPipe, DecimalPipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { MatFormField, MatHint, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatButton, MatIconButton } from "@angular/material/button";
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

    // FIXME hardcoded values
    this.form = new FormGroup({
      address: new FormControl('0x4b807A18ff07c8D9e97979EF73e5C575E9D684B3', [Validators.required]),
      amount: new FormControl(0.01, [Validators.required]),
      paymaster: new FormControl(Paymasters.GHO), // FIXME: change to empty
    });
  }

  send(): void {
    this.loading$.next(true);
    this.service.sendAsset(this.token, this.form.value).pipe(
      finalize(() => this.loading$.next(false)),
    ).subscribe(console.log);
  }

  close(): void {
    this.ref.dismiss();
  }
}

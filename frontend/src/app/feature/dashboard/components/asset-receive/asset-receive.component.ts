import { Component, Inject, Optional } from '@angular/core';
import { QRCodeModule } from "angularx-qrcode";
import { WalletService } from "../../../../core/services/wallet/wallet.service";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { ERC20Token } from "../../interfaces";
import { OperationHeaderComponent } from "../operation-header/operation-header.component";
import { AsyncPipe, NgIf } from "@angular/common";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CdkCopyToClipboard } from "@angular/cdk/clipboard";
import { WalletAddressPipe } from "../../../../core/pipes/wallet-address.pipe";

@Component({
  selector: 'app-asset-receive',
  standalone: true,
  imports: [QRCodeModule, OperationHeaderComponent, AsyncPipe, NgIf, MatIconButton, MatIcon, CdkCopyToClipboard, WalletAddressPipe],
  templateUrl: './asset-receive.component.html',
  styleUrl: './asset-receive.component.scss'
})
export class AssetReceiveComponent {
  walletAddress: Promise<string>;

  constructor(
    @Optional() @Inject(MAT_BOTTOM_SHEET_DATA) public token: ERC20Token | undefined,
    private wallet: WalletService,
    private ref: MatBottomSheetRef<AssetReceiveComponent>,
  ) {
    this.walletAddress = this.wallet.getWalletAddress()
  }

  close(): void {
    this.ref.dismiss();
  }
}

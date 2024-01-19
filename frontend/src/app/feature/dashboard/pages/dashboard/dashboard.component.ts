import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { WalletService } from "../../../../core/services/wallet/wallet.service";
import { MatTabsModule } from "@angular/material/tabs";
import { TokensListComponent } from "../../components/tokens-list/tokens-list.component";
import { HistoryComponent } from "../../components/history/history.component";
import { CdkCopyToClipboard } from "@angular/cdk/clipboard";
import { WalletAddressPipe } from "../../../../core/pipes/wallet-address.pipe";
import { AssetOperationsComponent } from "../../components/asset-operations/asset-operations.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    TokensListComponent,
    HistoryComponent,
    CdkCopyToClipboard,
    WalletAddressPipe,
    AssetOperationsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  address$: Promise<string>
  balance$: Promise<string>;
  constructor(private appService: WalletService) {
    this.address$ = this.appService.getWalletAddress();
    this.balance$ = this.appService.getBalance();
  }
}

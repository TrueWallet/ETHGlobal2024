import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Erc20ManagerService } from "../../services/erc20-manager/erc20-manager.service";
import { Observable } from "rxjs";
import { ERC20TokenWithBalance } from "../../interfaces/erc20-token";
import { MatListModule } from "@angular/material/list";
import { AsyncPipe, DecimalPipe, NgForOf, NgIf } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { AssetDetailsComponent } from "../asset-details/asset-details.component";

@Component({
  selector: 'app-tokens-list',
  standalone: true,
  imports: [
    MatListModule,
    AsyncPipe,
    NgForOf,
    NgIf,
    MatButtonModule,
    DecimalPipe,
  ],
  templateUrl: './tokens-list.component.html',
  styleUrl: './tokens-list.component.scss',
  providers: [ Erc20ManagerService ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensListComponent {
  tokens$: Observable<ERC20TokenWithBalance[]>;

  constructor(
    private erc20Manager: Erc20ManagerService,
    private dialog: MatDialog,
  ) {
    this.tokens$ = this.erc20Manager.getTokensList();
  }

  showDetails(item: ERC20TokenWithBalance): void {
    this.dialog.open(AssetDetailsComponent, {
      data: item,
      panelClass: 'asset-details',
      disableClose: true,
      width: '100%',
      height: '100%',
      maxWidth: '100%',
      autoFocus: false,
    })
  }
}

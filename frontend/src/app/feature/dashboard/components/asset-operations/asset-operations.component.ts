import { Component, Input } from '@angular/core';
import { AssetOperation, ERC20Token } from "../../interfaces/erc20-token";
import { NgClass, NgForOf, NgSwitch, NgSwitchCase } from "@angular/common";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { AssetSendComponent } from "../asset-send/asset-send.component";
import { AssetReceiveComponent } from "../asset-receive/asset-receive.component";
import { Erc20BorrowComponent } from "../erc20-borrow/erc20-borrow.component";
import { AssetBuyComponent } from "../asset-buy/asset-buy.component";
import { AssetDepositComponent } from "../asset-p2-p/asset-deposit.component";

@Component({
  selector: 'app-asset-operations',
  standalone: true,
  imports: [
    NgForOf,
    NgSwitch,
    NgSwitchCase,
    NgClass
  ],
  templateUrl: './asset-operations.component.html',
  styleUrl: './asset-operations.component.scss'
})
export class AssetOperationsComponent {
  @Input() view: 'wide' | 'centered' = 'wide';
  @Input() set asset(value: ERC20Token) {
    if (value) {
      this.token = value;
      this.operations = value.operations;
    }
  };

  token!: ERC20Token;

  operations: AssetOperation[] = [
    AssetOperation.send,
    AssetOperation.receive,
    AssetOperation.deposit,
    AssetOperation.buy,
  ];

  constructor(private bottomSheet: MatBottomSheet) {
    // FIXME: remove this
    this.handleOperation(AssetOperation.send);
  }

  handleOperation(operation: AssetOperation): any {
    const bsConfig = {
      data: this.token,
      panelClass: 'erc20-operation',
      disableClose: true,
      closeOnNavigation: true,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
    }

    switch (operation) {
      case AssetOperation.send:
        return this.bottomSheet.open(AssetSendComponent, bsConfig);
      case AssetOperation.receive:
        return this.bottomSheet.open(AssetReceiveComponent, bsConfig);
      case AssetOperation.borrow:
        return this.bottomSheet.open(Erc20BorrowComponent, bsConfig);
      case AssetOperation.buy:
        return this.bottomSheet.open(AssetBuyComponent, bsConfig);
      case AssetOperation.deposit:
        return this.bottomSheet.open(AssetDepositComponent, bsConfig);
      default:
        throw new Error(`Operation ${operation} not supported`);
    }
  }

  protected readonly ERC20Operation = AssetOperation;
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AssetOperation, ERC20Token } from "../../interfaces";
import { NgClass, NgForOf, NgSwitch, NgSwitchCase } from "@angular/common";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { AssetSendComponent } from "../asset-send/asset-send.component";
import { AssetReceiveComponent } from "../asset-receive/asset-receive.component";
import { Erc20BorrowComponent } from "../erc20-borrow/erc20-borrow.component";
import { AssetBuyComponent } from "../asset-buy/asset-buy.component";
import { AssetDepositComponent } from "../asset-deposit/asset-deposit.component";
import { map } from "rxjs";

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

  @Output() processed: EventEmitter<void> = new EventEmitter<void>();

  token!: ERC20Token;

  operations: AssetOperation[] = [
    AssetOperation.send,
    AssetOperation.receive,
    AssetOperation.deposit,
    AssetOperation.buy,
  ];

  protected readonly ERC20Operation = AssetOperation;

  constructor(private bottomSheet: MatBottomSheet) {
  }

  handleOperation(operation: AssetOperation): void {
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
        this.bottomSheet.open(AssetSendComponent, bsConfig).afterDismissed().pipe(
          map(() => this.processed.emit()),
        ).subscribe();
        break;
      case AssetOperation.receive:
        this.bottomSheet.open(AssetReceiveComponent, bsConfig);
        break;
      case AssetOperation.borrow:
        this.bottomSheet.open(Erc20BorrowComponent, bsConfig).afterDismissed().pipe(
          map(() => this.processed.emit()),
        ).subscribe();
        break;
      case AssetOperation.buy:
        this.bottomSheet.open(AssetBuyComponent, bsConfig);
        break;
      case AssetOperation.deposit:
        this.bottomSheet.open(AssetDepositComponent, bsConfig).afterDismissed().pipe(
          map(() => this.processed.emit()),
        ).subscribe();
        break;
      default:
        throw new Error(`Operation ${operation} not supported`);
    }
  }
}

import { Component, Input } from '@angular/core';
import { ERC20Operation, ERC20Token } from "../../interfaces/erc20-token";
import { NgClass, NgForOf, NgSwitch, NgSwitchCase } from "@angular/common";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { Erc20SendComponent } from "../erc20-send/erc20-send.component";
import { Erc20ReceiveComponent } from "../erc20-receive/erc20-receive.component";
import { Erc20BorrowComponent } from "../erc20-borrow/erc20-borrow.component";
import { AssetBuyComponent } from "../asset-buy/asset-buy.component";
import { AssetP2PComponent } from "../asset-p2-p/asset-p2-p.component";

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

  operations: ERC20Operation[] = [
    ERC20Operation.send,
    ERC20Operation.receive,
    // ERC20Operation.borrow,
    ERC20Operation.buy,
    ERC20Operation.p2p,
  ];

  constructor(private bottomSheet: MatBottomSheet) {
  }

  handleOperation(operation: ERC20Operation): any {
    const bsConfig = {
      data: this.token,
      panelClass: 'erc20-operation',
      // disableClose: true,
      closeOnNavigation: true,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
    }

    switch (operation) {
      case ERC20Operation.send:
        return this.bottomSheet.open(Erc20SendComponent, bsConfig);
      case ERC20Operation.receive:
        return this.bottomSheet.open(Erc20ReceiveComponent, bsConfig);
      case ERC20Operation.borrow:
        return this.bottomSheet.open(Erc20BorrowComponent, bsConfig);
      case ERC20Operation.buy:
        return this.bottomSheet.open(AssetBuyComponent, bsConfig);
      case ERC20Operation.p2p:
        return this.bottomSheet.open(AssetP2PComponent, bsConfig);
      default:
        throw new Error(`Operation ${operation} not supported`);
    }
  }

  protected readonly ERC20Operation = ERC20Operation;
}

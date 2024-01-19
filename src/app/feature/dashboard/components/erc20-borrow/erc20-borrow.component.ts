import { Component, Inject, Injector } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet, MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { ERC20Token } from "../../interfaces/erc20-token";
import { MatButtonModule } from "@angular/material/button";
import { Erc20ManagerService } from "../../services/erc20-manager/erc20-manager.service";

@Component({
  selector: 'app-erc20-borrow',
  standalone: true,
  imports: [
    MatButtonModule,
  ],
  templateUrl: './erc20-borrow.component.html',
  styleUrl: './erc20-borrow.component.scss',
})
export class Erc20BorrowComponent {
  token: ERC20Token;
  data: any = {
    amount: '0.1',
  };

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) data: ERC20Token,
    private erc20Manager: Erc20ManagerService,
  ) {
    this.token = data;
  }

  borrow(): void {
    this.erc20Manager.borrowERC20(this.token, this.data);
  }
}

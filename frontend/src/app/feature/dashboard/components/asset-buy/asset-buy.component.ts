import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { ERC20Token } from "../../interfaces";
import { OperationHeaderComponent } from "../operation-header/operation-header.component";

@Component({
  selector: 'app-asset-buy',
  standalone: true,
  imports: [
    OperationHeaderComponent
  ],
  templateUrl: './asset-buy.component.html',
  styleUrl: './asset-buy.component.scss'
})
export class AssetBuyComponent {
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public token: ERC20Token | undefined,
    private ref: MatBottomSheetRef<AssetBuyComponent>,
  ) {
  }

  close(): void {
    this.ref.dismiss();
  }
}

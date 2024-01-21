import { Component, Inject } from '@angular/core';
import { ERC20TokenWithBalance } from "../../interfaces";
import { MAT_DIALOG_DATA, MatDialogClose } from "@angular/material/dialog";
import { AssetOperationsComponent } from "../asset-operations/asset-operations.component";
import { AsyncPipe, DecimalPipe } from "@angular/common";

@Component({
  selector: 'app-asset-details',
  standalone: true,
  imports: [
    AssetOperationsComponent,
    AsyncPipe,
    MatDialogClose,
    DecimalPipe
  ],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.scss'
})
export class AssetDetailsComponent {

  // TODO: refresh balance after send/borrow
  constructor(@Inject(MAT_DIALOG_DATA) public token: ERC20TokenWithBalance) {
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { ERC20Token } from "../../interfaces/erc20-token";

@Component({
  selector: 'app-erc20-send',
  standalone: true,
  imports: [],
  templateUrl: './erc20-send.component.html',
  styleUrl: './erc20-send.component.scss'
})
export class Erc20SendComponent {
  token: ERC20Token | null;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) token: ERC20Token | undefined) {
    this.token = token || null;
    console.log(token);
  }
}

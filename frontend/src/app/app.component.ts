import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatSelectModule } from "@angular/material/select";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatButton } from "@angular/material/button";
import { WalletService } from "./core/services/wallet/wallet.service";
import { Observable } from "rxjs";
import { Chain } from "./core/configs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatSelectModule, RouterLinkActive, MatMenuTrigger, MatMenu, MatMenuItem, MatButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  chains: Chain[];
  currentChain$: Observable<Chain>;

  constructor(private wallet: WalletService) {
    this.chains = this.wallet.getChains();
    this.currentChain$ = this.wallet.currentChain$.asObservable();
  }
}

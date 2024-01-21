import { Injectable } from "@angular/core";
import { TrueWalletSDK } from "true-wallet-sdk";
import { BehaviorSubject, Observable } from "rxjs";
import { Chain, chains } from "../../configs";

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private _sdk!: TrueWalletSDK;
  private _chains: Chain[] = chains;
  currentChain$: BehaviorSubject<Chain>;

  get sdk(): TrueWalletSDK {
    return this._sdk;
  }

  constructor() {
    this.currentChain$ = new BehaviorSubject<Chain>(this._chains[0]);
  }

  initialize(sdk: TrueWalletSDK) {
    this._sdk = sdk;
  }

  async getWalletAddress(): Promise<string> {
    return this._sdk.walletAddress;
  }

  async getBalance(): Promise<string> {
    return await this.sdk.getBalance();
  }

  getChains(): Chain[] {
    return this._chains;
  }
}

import { Injectable } from "@angular/core";
import { TrueWalletSDK } from "true-wallet-sdk";

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  _sdk!: TrueWalletSDK;

  get sdk(): TrueWalletSDK {
    return this._sdk;
  }

  constructor() { }

  initialize(sdk: TrueWalletSDK) {
    this._sdk = sdk;
  }

  async getWalletAddress(): Promise<any> {
    return this._sdk.walletAddress;
  }

  async getBalance(): Promise<string> {
    return await this.sdk.getBalance();
  }
}

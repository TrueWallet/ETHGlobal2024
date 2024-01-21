import { Injectable } from '@angular/core';
import { ERC20Token } from "../../interfaces";
import { encodeFunctionData } from "true-wallet-sdk";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { ethers } from "ethers";
import { WalletService } from "../../../../core/services/wallet/wallet.service";
import { filter, from, Observable, of, repeat, switchMap, takeWhile, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DepositService {

  constructor(private wallet: WalletService) { }

  deposit(token: ERC20Token, depositAmount: string): Observable<any> {
    const abi = ['function depositETH(address, address onBehalfOf, uint16 referralCode) external payable'];
    const txData = encodeFunctionData(
      abi,
      'depositETH',
      [this.wallet.sdk.walletAddress, this.wallet.sdk.walletAddress, '0']
    );

    return from(this.wallet.sdk.execute(txData, AaveV3Sepolia.WETH_GATEWAY, ethers.utils.parseEther(depositAmount.toString()).toString())).pipe(
      switchMap((opHash) => this.waitForReceipt(opHash)),
    );
  }

  // fixme: duplicated code
  private waitForReceipt(opHash: string): Observable<any> {
    return of(opHash).pipe(
      tap((opHash) => {console.log('here opHash', opHash)}),
      switchMap((opHash: string) => from(this.wallet.sdk.bundlerClient.getUserOperationReceipt(opHash))),
      tap((receipt) => {console.log('receipt', receipt)}),
      repeat({delay: 10_000}),
      filter((receipt) => receipt !== null),
      takeWhile((receipt) => receipt === null, true),
    );
  }
}

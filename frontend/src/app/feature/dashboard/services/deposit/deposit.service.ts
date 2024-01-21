import { Injectable } from '@angular/core';
import { ERC20Token } from "../../interfaces";
import { encodeFunctionData } from "true-wallet-sdk";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { BigNumber, ethers } from "ethers";
import { WalletService } from "../../../../core/services/wallet/wallet.service";
import { from, map, Observable, switchMap, tap } from "rxjs";
import { NotificationsService } from "../notifications/notifications.service";
import { waitForUserOperation } from "../../../../core/helpers/wait-for-user-operation";

@Injectable({
  providedIn: 'root'
})
export class DepositService {

  constructor(
    private wallet: WalletService,
    private notifications: NotificationsService,
  ) { }

  deposit(token: ERC20Token, depositAmount: string): Observable<any> {
    const abi = ['function depositETH(address, address onBehalfOf, uint16 referralCode) external payable'];
    const txData = encodeFunctionData(
      abi,
      'depositETH',
      [this.wallet.sdk.walletAddress, this.wallet.sdk.walletAddress, '0']
    );

    return from(this.wallet.sdk.execute(txData, AaveV3Sepolia.WETH_GATEWAY, ethers.utils.parseEther(depositAmount.toString()).toString())).pipe(
      switchMap((opHash) => waitForUserOperation(opHash, this.wallet.sdk)),
      tap((receipt) => this.notifications.success({
        title: 'Operation successful.',
        message: `You have successfully deposited ${depositAmount} ETH.`,
      })),
    );
  }

  getDepositedAmount(): Observable<string> {
    // fixme: refactor
    const contract = new ethers.Contract(
      '0x5b071b590a59395fE4025A0Ccc1FcC931AAc1830',
      ['function balanceOf(address user) public view returns (uint256)'],
      // @ts-ignore
      new ethers.providers.JsonRpcProvider(this.wallet.sdk.config.rpcProviderUrl),
    );

    return from(contract['balanceOf'](this.wallet.sdk.walletAddress)).pipe(
      map((balance) => ethers.utils.formatEther(balance as BigNumber)),
    );
  }
}

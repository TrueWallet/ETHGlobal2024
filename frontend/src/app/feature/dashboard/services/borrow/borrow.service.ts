import { Injectable } from '@angular/core';
import { WalletService } from "../../../../core/services/wallet/wallet.service";
import { ERC20Token } from "../../interfaces";
import { Pool } from "@aave/contract-helpers";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { BigNumber, ethers, providers } from "ethers";
import { encodeFunctionData } from "true-wallet-sdk";
import {
  from,
  lastValueFrom,
  map,
  Observable,
  switchMap,
  tap,
} from "rxjs";
import { NotificationsService } from "../notifications/notifications.service";
import { MatDialog } from "@angular/material/dialog";
import { BorrowToPaymasterComponent } from "../../components/borrow-to-paymaster/borrow-to-paymaster.component";
import { waitForUserOperation } from "../../../../core/helpers/wait-for-user-operation";

@Injectable({
  providedIn: 'root'
})
export class BorrowService {
  readonly provider: providers.JsonRpcProvider;
  readonly pool!: Pool;

  constructor(
    private wallet: WalletService,
    private notifications: NotificationsService,
    private matDialog: MatDialog,
  ) {
    // @ts-ignore fixme
    this.provider = new providers.JsonRpcProvider(this.wallet.sdk.config.rpcProviderUrl);
    this.pool = new Pool(this.provider, {
      POOL: AaveV3Sepolia.POOL,
      WETH_GATEWAY: AaveV3Sepolia.WETH_GATEWAY,
    });
  }

  async getBorrowAllowance(toAddress: string, borrowTokenAddress: string): Promise<string> {
    const { variableDebtTokenAddress} = await this.pool.getReserveData(borrowTokenAddress);
    const debtContract = new ethers.Contract(
      variableDebtTokenAddress,
      ['function borrowAllowance(address fromUser, address toUser) view returns (uint256)'],
      this.provider
    );

    const borrowAllowance: BigNumber = await debtContract['borrowAllowance'](this.wallet.sdk.walletAddress, toAddress);
    return borrowAllowance.toString();
  }

  borrowERC20(token: ERC20Token, amount: string): Observable<any> {
    const txBorrowParams = [
      token.address, // reserve address
      ethers.utils.parseEther(amount.toString()).toBigInt(),
      2,  // InterestRate - for GHO only 'Variable'
      0, // referralCode,
      this.wallet.sdk.walletAddress, // params.onBehalfOf
    ];

    const abi = ['function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) public']
    const borrowTxData = encodeFunctionData(abi, 'borrow', txBorrowParams);

    return from(this.wallet.sdk.execute(borrowTxData, AaveV3Sepolia.POOL)).pipe(
      switchMap((opHash: string) => waitForUserOperation(opHash, this.wallet.sdk)),
      tap(() => this.notifications.success({
        title: 'Operation successful',
        message: `You have successfully borrowed ${amount} ${token.symbol}.`
      })),
    );
  }

   approveDelegation(delegatee: string, amount: string, borrowToken: string): Observable<any> {
    const delegateData = encodeFunctionData(
      ['function approveDelegation(address delegatee, uint256 amount) public'],
      'approveDelegation',
      [delegatee, ethers.utils.parseUnits(amount.toString()).toBigInt()]
    );

    return from(this.pool.getReserveData(borrowToken)).pipe(
      map((reserveData) => reserveData.variableDebtTokenAddress),
      switchMap((variableDebtTokenAddress) => this.wallet.sdk.execute(delegateData, variableDebtTokenAddress)),
      switchMap((opHash: string) => waitForUserOperation(opHash, this.wallet.sdk)),
    );
  }

  async setBorrowAllowance(toAddress: string): Promise<any> {
    return lastValueFrom(this.matDialog.open(BorrowToPaymasterComponent, {
      data: toAddress,
      disableClose: true,
    }).afterClosed());
  }
}

import { Injectable } from '@angular/core';
import { WalletService } from "../../../../core/services/wallet/wallet.service";
import { ERC20Token } from "../../interfaces";
import { Pool } from "@aave/contract-helpers";
import { AaveV3Sepolia } from "@bgd-labs/aave-address-book";
import { BigNumber, ethers, providers } from "ethers";
import { encodeFunctionData } from "true-wallet-sdk";
import {
  filter,
  from,
  lastValueFrom,
  map,
  Observable,
  of,
  repeat,
  switchMap,
  takeWhile,
  tap,
} from "rxjs";
import { NotificationsService } from "../notifications/notifications.service";
import { MatDialog } from "@angular/material/dialog";
import { BorrowToPaymasterComponent } from "../../components/borrow-to-paymaster/borrow-to-paymaster.component";

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
    console.log('pool address', AaveV3Sepolia.POOL);
    console.log('weth gateway', AaveV3Sepolia.WETH_GATEWAY);
    this.pool = new Pool(this.provider, {
      POOL: AaveV3Sepolia.POOL,
      WETH_GATEWAY: AaveV3Sepolia.WETH_GATEWAY,
    });

    console.log('pool', this.pool);
    // const factory = this.pool.getUserAccountData('');
  }

  async getDepositedAmount(token: ERC20Token): Promise<string> {
    // TODO: check if we can borrow
    const contract = this.pool.getContractInstance(AaveV3Sepolia.POOL);
    const data = await contract.getUserAccountData(this.wallet.sdk.walletAddress);
    console.log('getUserAccountData', data.availableBorrowsBase.toString(), data);

    const getUserConfiguration = await contract.getUserConfiguration(this.wallet.sdk.walletAddress);
    console.log('getUserConfiguration', getUserConfiguration.toString(), getUserConfiguration);


    console.log(token);
    const reserveData = await this.pool.getReserveData(token.address);
    console.log(reserveData);

    const debtContract = new ethers.Contract(
      reserveData.variableDebtTokenAddress,
      [
        'function borrowAllowance(address fromUser, address toUser) view returns (uint256)',
      ],
      this.provider
    );

    const borrowAllowance: BigNumber = await debtContract['borrowAllowance'](this.wallet.sdk.walletAddress, this.wallet.sdk.walletAddress);
    console.log('borrowAllowance', borrowAllowance);
    return borrowAllowance.toString();
  }

  async getBorrowAllowance(toAddress: string, borrowTokenAddress: string): Promise<string> {
    const { variableDebtTokenAddress} = await this.pool.getReserveData(borrowTokenAddress);
    const debtContract = new ethers.Contract(
      variableDebtTokenAddress,
      ['function borrowAllowance(address fromUser, address toUser) view returns (uint256)'],
      this.provider
    );

    const borrowAllowance: BigNumber = await debtContract['borrowAllowance'](this.wallet.sdk.walletAddress, toAddress);
    console.log('borrowAllowance', borrowAllowance);
    return borrowAllowance.toString();
  }

  borrowERC20(token: ERC20Token, amount: number): Observable<any> {
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
      tap((opHash) => {console.log('opHash', opHash)}),
      switchMap((opHash: string) => from(this.wallet.sdk.bundlerClient.getUserOperationReceipt(opHash))),
      tap((receipt) => {console.log('receipt', receipt)}),
      repeat({delay: 10_000}),
      filter((receipt) => receipt !== null),
      takeWhile((receipt) => receipt === null, true),
      tap(() => this.notifications.success('Transaction has been sent')),
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
      switchMap((opHash: string) => this.waitForReceipt(opHash)),
    );
  }

  async setBorrowAllowance(toAddress: string): Promise<any> {
    return lastValueFrom(this.matDialog.open(BorrowToPaymasterComponent, {
      data: toAddress,
      disableClose: true,
    }).afterClosed());
  }


  // FIXME duplicate
  private waitForReceipt(opHash: string): Observable<any> {
    console.log('waitForReceipt', opHash);
    return of(opHash).pipe(
      tap((opHash) => {console.log('Waiting operation with opHash', opHash)}),
      // switchMap((opHash: string) => from(this.wallet.sdk.bundlerClient.getUserOperationReceipt(opHash))),
      switchMap((opHash: string) => this.wallet.sdk.bundlerClient.getUserOperationReceipt(opHash)),
      tap((receipt) => {console.log('receipt', receipt)}),
      repeat({delay: 10_000}),
      filter((receipt) => receipt !== null),
      takeWhile((receipt) => receipt === null, true),
    );
  }
}

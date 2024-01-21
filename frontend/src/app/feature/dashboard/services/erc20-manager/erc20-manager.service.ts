import { Injectable } from '@angular/core';
import { catchError, filter, from, map, Observable, of, repeat, switchMap, takeWhile, tap, throwError } from "rxjs";
import { ERC20TokenWithBalance, SendData } from "../../interfaces";
import { WalletService } from "../../../../core/services/wallet/wallet.service";
import { NotificationsService } from "../notifications/notifications.service";
import { Addresses, ERC20TokensList, Paymasters } from "../../../../core/configs";
import { BorrowService } from "../borrow/borrow.service";

@Injectable({
  providedIn: 'root'
})
export class Erc20ManagerService {
  constructor(
    private wallet: WalletService,
    private notifications: NotificationsService,
    private borrowService: BorrowService,
  ) { }

  getTokensList(): Observable<ERC20TokenWithBalance[]> {
    return of(ERC20TokensList).pipe(
      map(tokens => tokens.map(token => ({
        ...token,
        balance: this.wallet.sdk.getERC20Balance(token.address),
      }))),
    );
  }

  sendAsset(token: ERC20TokenWithBalance | null, data: SendData): Observable<any> {
    return from(this.getSendOperation(token, data)).pipe(
      tap((opHash) => {console.log('opHash', opHash)}),
      switchMap((opHash) => this.waitForReceipt(opHash)),
      tap(() => this.notifications.success('Transaction has been sent')),
    );
  }

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

  private async getSendOperation(token: ERC20TokenWithBalance | null, data: SendData): Promise<any> {
    if (data.paymaster === Paymasters.GHO) {
      await this.checkGHOAllowance(Paymasters.GHO);
    }

    return token ?
      this.wallet.sdk.sendErc20(token.address, data.amount.toString(), token.address, data.paymaster) :
      this.wallet.sdk.send(data.address, data.amount.toString(), data.paymaster);
  }

  private async checkGHOAllowance(toAddress: string): Promise<void> {
    const borrowAllowance = await this.borrowService.getBorrowAllowance(toAddress, Addresses.GHO);

    if (borrowAllowance === '0') {
      await this.borrowService.setBorrowAllowance(toAddress);
    }
  }
}

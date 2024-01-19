import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from "rxjs";
import { ERC20Token, ERC20TokenWithBalance } from "../../interfaces/erc20-token";
import { ERC20TokensList } from "../../constants/erc20-tokens-list";
import { WalletService } from "../../../../core/services/wallet/wallet.service";
import { GHOToken } from "../../../../core/classes/GHOToken";
import { InterestRate } from "@aave/contract-helpers";

@Injectable({
  providedIn: 'root'
})
export class Erc20ManagerService {
  constructor(
    private walletService: WalletService,
  ) { }

  getTokensList(): Observable<ERC20TokenWithBalance[]> {
    return of(ERC20TokensList).pipe(
      map(tokens => tokens.map(token => ({
        ...token,
        balance: this.walletService.sdk.getERC20Balance(token.address),
      }))),
    );
  }

  sendERC20(item: ERC20Token): Observable<any> {
    console.log('Send ERC20', item);
    return of(true);
  }

  receiveERC20(item: ERC20Token): Observable<any> {
    console.log('Receive ERC20', item);
    return of(true);
  }

  async borrowERC20(item: ERC20Token, data: any): Promise<any> {
    // FIXME: make dynamic
    const params = Object.assign({
      user: this.walletService.sdk.walletAddress,
      // user: '0xF8185B9556648f56dee28C217caaA768745eD0E7',
      // onBehalfOf: this.walletService.sdk.walletAddress,
      reserve: '0xc4bF5CbDaBE595361438F8c6a187bDc330539c60',
      interestRateMode: InterestRate.Variable,
    }, data);

    const gho = new GHOToken(this.walletService.sdk);

    // @ts-ignore // fixme call private
    const res = await gho.borrow(params, this.walletService.sdk.config.rpcProviderUrl);
    console.log('Borrow result', res);

    return res;
  }
}

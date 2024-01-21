import { TrueWalletSDK } from "true-wallet-sdk";
import { filter, from, of, repeat, switchMap, takeWhile, tap } from "rxjs";

export const waitForUserOperation = (opHash: string, sdk: TrueWalletSDK) => {
  return of(opHash).pipe(
    tap((opHash) => {console.log('Waiting operation with opHash', opHash)}),
    switchMap((opHash: string | any) => typeof opHash === "string" ? from(sdk.bundlerClient.getUserOperationReceipt(opHash)): of(opHash)),
    repeat({delay: 10_000}),
    filter((receipt) => receipt !== null),
    takeWhile((receipt) => receipt === null, true),
  );
};

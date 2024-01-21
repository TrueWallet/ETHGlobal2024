import { APP_INITIALIZER } from "@angular/core";
import { WalletService } from "../services/wallet/wallet.service";
import { init, TrueWalletSDK } from "true-wallet-sdk";
import { TW_USER_ID } from "./user-data-provider";

export const twInitProvider = {
  provide: APP_INITIALIZER,
  useFactory: (userId: string, appService: WalletService) => async () => {
    console.log('twInitProvider', userId);
    // TODO: throw error if userId is null
    const sdk: TrueWalletSDK = await init({
      salt: `wallet-${userId}`,
      // paymaster: '0x6EDB39854ed6BF00b6E0fe69B2a8F3879C594561',
    });
    appService.initialize(sdk);
    return sdk;
  },
  deps: [TW_USER_ID, WalletService],
  multi: true,
};

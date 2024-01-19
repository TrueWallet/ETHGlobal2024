import { InjectionToken } from "@angular/core";

export const TW_USER_ID = new InjectionToken<string>('Telegram user id to create wallet');

export const userProvider = {
  provide: TW_USER_ID,
  useFactory: () => window.Telegram?.WebApp?.initDataUnsafe?.user?.id,
}

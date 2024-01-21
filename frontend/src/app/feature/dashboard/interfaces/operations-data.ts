import { Paymasters } from "../../../core/configs";

export interface SendData {
  address: string;
  amount: string;
  paymaster: Paymasters;
}

export interface BorrowData {
  asset: string;
  amount: string; // in wei
  interestRateMode: string; // 1 - stable, 2 - variable
  referralCode: string; // 0 - no referral
  onBehalfOf: string; // wallet to borrow for
}

export interface DepositData {
  payableAmount: string; // in ether
  address: string;
  onBehalfOf: string; // wallet to borrow for
  referralCode: string; // 0 - no referral
}

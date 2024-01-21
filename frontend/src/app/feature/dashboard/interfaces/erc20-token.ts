export enum AssetOperation {
  send = 'Send',
  receive = 'Receive',
  borrow = 'Borrow',
  deposit = 'Deposit',
  buy = 'Buy',
}

export interface ERC20Token {
  title: string;
  address: string;
  symbol: string;
  icon: string;
  operations: AssetOperation[];
}

export interface ERC20TokenWithBalance extends ERC20Token {
  balance: Promise<string>;
}

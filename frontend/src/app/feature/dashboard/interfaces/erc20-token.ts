export enum ERC20Operation {
  send = 'Send',
  receive = 'Receive',
  borrow = 'Borrow',
  buy = 'Buy',
  p2p = 'P2P',
}

export interface ERC20Token {
  title: string;
  address: string;
  ticker: string;
  icon: string;
  operations: ERC20Operation[];
}

export interface ERC20TokenWithBalance extends ERC20Token {
  balance: Promise<string>;
}

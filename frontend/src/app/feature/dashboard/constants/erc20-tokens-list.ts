import { ERC20Operation, ERC20Token } from "../interfaces/erc20-token";

export const ERC20TokensList: ERC20Token[] = [
  {
    address: '0x88541670E55cC00bEEFD87eB59EDd1b7C511AC9a',
    title: 'AAVE PROTOCOL',
    ticker: 'AAVE',
    icon: 'assets/icons/aave.svg',
    operations: [ERC20Operation.send, ERC20Operation.receive],
  },
  {
    address: '0xc4bF5CbDaBE595361438F8c6a187bDc330539c60',
    title: 'Gho Token',
    ticker: 'GHO',
    icon: 'assets/icons/gho.svg',
    operations: [ERC20Operation.send, ERC20Operation.receive, ERC20Operation.borrow],
  },
  {
    address: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
    title: 'Tether',
    ticker: 'USDT',
    icon: 'assets/icons/usdt.svg',
    operations: [ERC20Operation.send, ERC20Operation.receive],
  }
];

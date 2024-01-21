export interface Chain {
  id: number;
  name: string;
  symbol: string;
  enabled: boolean;
}

export const chains: Chain[] = [{
  id: 11155111,
  name: 'Ethereum Sepolia',
  symbol: 'SepETH',
  enabled: true,
}, {
  id: 5,
  name: 'Ethereum Goerli',
  symbol: 'GorETH',
  enabled: false,
}, {
  id: 59144,
  name: 'Ethereum Linea',
  symbol: 'LinETH',
  enabled: false,
}];

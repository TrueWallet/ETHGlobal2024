import { AssetOperation, ERC20Token } from "../../feature/dashboard/interfaces";
import { Addresses } from "./addresses";

export const ERC20TokensList: ERC20Token[] = [
  {
    address: Addresses.GHO,
    title: 'GHO Token',
    symbol: 'GHO',
    icon: 'assets/icons/gho.svg',
    operations: [AssetOperation.send, AssetOperation.receive, AssetOperation.borrow],
  },
  {
    address: Addresses.USDT,
    title: 'Tether',
    symbol: 'USDT',
    icon: 'assets/icons/usdt.svg',
    operations: [AssetOperation.send, AssetOperation.receive],
  },
  {
    address: Addresses.AAVE,
    title: 'AAVE PROTOCOL',
    symbol: 'AAVE',
    icon: 'assets/icons/aave.svg',
    operations: [AssetOperation.send, AssetOperation.receive],
  },
];

## Project Description

Telegram-based Account Abstraction (ERC-4337) wallet where a user can borrow GHO using AAVE protocol. Also, it's possible to delegate a borrow to the Paymaster for further transfers without a transaction fee.

The project features:
* Integration with the Telegram app
* Send and receive native and ERC-20 tokens
* Supply and borrow tokens using the Aave protocol
* Use a borrow as a transaction fee payment

## How it's Made

The project is based on the TrueWallet Smart Accounts provider and integrated with Aave Protocol and Telegram Mini App. Telegram Mini App wrapped in the Angular framework with TrueWallet SDK for Smart accounts integration. The wallet can supply and borrow through communication with Aave smart contracts. There was developed GHO Paymaster which can use a user's borrow as a transaction payment instead of classic native token or ERC-20 tokens.

**Pay attention**: This project is only for a demo purpose and is not production-ready. It sends a transaction using GHO Paymaster directly to the EntryPoint, but not via Bundler. Because the Bundler has next restriction:
```
The idea is that any storage access represents the danger of a false simulation because that storage slot can change between simulation and execution
```

But it will be useful in L2 blockchains with the Account Abstraction native support.

DIR="./node_modules/true-wallet-sdk"

if [ -d "$DIR" ]; then
  cd $DIR
  if [ ! -e .env ]; then
    echo "DEFAULT_BUNDLER_URL=https://eth-sepolia.g.alchemy.com/v2/U7yzwLUlEjzfPKgBbYGB3U_ZVEMelwF2" >> .env &&
    echo "DEFAULT_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/U7yzwLUlEjzfPKgBbYGB3U_ZVEMelwF2" >> .env &&
    echo "FACTORY_ADDRESS=0xAAEa0835252bdBdCe249d1dBAA7970473041A9E7" >> .env &&
    echo "ENTRYPOINT_ADDRESS=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789" >> .env &&
    echo "SECURITY_CONTROL_MODULE_ADDRESS=0x2B368fd990bB261B705D16162715b1f3F6b446D0" >> .env &&
    echo "SOCIAL_RECOVERY_MODULE_ADDRESS=0xc665Bc92070B75BfA7939D7eEaB2099a606D9417" >> .env
  fi

  npm install && npm run build
  echo "TrueWallet SDK build succeeded"
else
  echo "TrueWallet SDK is not installed"
fi

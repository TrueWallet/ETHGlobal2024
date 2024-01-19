import { WalletAddressPipe } from './wallet-address.pipe';

describe('WalletAddressPipe', () => {
  it('create an instance', () => {
    const pipe = new WalletAddressPipe();
    expect(pipe).toBeTruthy();
  });
});

import { ERC20Token } from "../../feature/dashboard/interfaces/erc20-token";

export class ERCToken {
  async send(item: ERC20Token, recipient: string, value: string): Promise<any> {
    console.log('Send ERC20', item);
  }

  async receive(item: ERC20Token): Promise<any> {
    console.log('Receive ERC20', item);
  }
}

import { Injectable } from '@nestjs/common';
import { CallWithERC2771Request, GelatoRelay } from '@gelatonetwork/relay-sdk';
import { Wallet } from 'ethers';

@Injectable()
export class GelatoProvider {
  private readonly relay = new GelatoRelay();
  private readonly apiKey = process.env.GELATO_API_KEY!;
  private readonly relaySigner = process.env.ORACLE_PRIVATE_KEY
    ? new Wallet(process.env.ORACLE_PRIVATE_KEY)
    : undefined;

  async sponsorCallERC2771(request: CallWithERC2771Request) {
    if (!this.relaySigner) {
      throw new Error('ORACLE_PRIVATE_KEY is required for ERC2771 relay signing');
    }
    const response = await this.relay.sponsoredCallERC2771(
      request,
      this.relaySigner,
      this.apiKey,
      {
        retries: 3,
        gasLimit: BigInt(500000),
      },
    );

    return { taskId: response.taskId };
  }

  async getTaskStatus(taskId: string) {
    return this.relay.getTaskStatus(taskId);
  }
}

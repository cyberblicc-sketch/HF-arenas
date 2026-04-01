import { Injectable } from '@nestjs/common';
import { CallWithERC2771Request, GelatoRelay, type SignerOrProvider } from '@gelatonetwork/relay-sdk';
import { ethers } from 'ethers';

@Injectable()
export class GelatoProvider {
  private readonly relay = new GelatoRelay();
  private readonly apiKey = process.env.GELATO_API_KEY!;
  private readonly signerOrProvider = new ethers.JsonRpcProvider(process.env.RPC_URL) as unknown as SignerOrProvider;

  async sponsorCallERC2771(request: CallWithERC2771Request) {
    const response = await this.relay.sponsoredCallERC2771(request, this.signerOrProvider, this.apiKey, {
      retries: 3,
      gasLimit: BigInt(500000),
    });

    return { taskId: response.taskId };
  }

  async getTaskStatus(taskId: string) {
    return this.relay.getTaskStatus(taskId);
  }
}

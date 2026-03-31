import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CallWithERC2771Request, GelatoRelay } from '@gelatonetwork/relay-sdk';

@Injectable()
export class GelatoProvider implements OnModuleInit {
  private readonly logger = new Logger(GelatoProvider.name);
  private readonly relay = new GelatoRelay();
  private apiKey = '';

  onModuleInit() {
    const key = process.env.GELATO_API_KEY;
    if (!key) {
      this.logger.warn('GELATO_API_KEY not set — relay calls will fail');
    }
    this.apiKey = key ?? '';
  }

  async sponsorCallERC2771(request: CallWithERC2771Request) {
    if (!this.apiKey) {
      throw new Error('GELATO_API_KEY is not configured');
    }
    const response = await this.relay.sponsoredCallERC2771(request, this.apiKey, {
      retries: 3,
      gasLimit: '500000',
    });

    return { taskId: response.taskId };
  }

  async getTaskStatus(taskId: string) {
    return this.relay.getTaskStatus(taskId);
  }
}

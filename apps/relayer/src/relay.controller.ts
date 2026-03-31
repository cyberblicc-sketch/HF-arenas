import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RelayService } from './relay.service';
import { SubmitRelayDto, OracleSignatureDto, TaskStatusDto, RelayResponseDto, normalizeAddress } from './dto/relay.dto';
import { SanctionsGuard } from './compliance/guards/sanctions.guard';

@ApiTags('Transaction Relay')
@Controller('v1/relay')
export class RelayController {
  constructor(private readonly relayService: RelayService) {}

  @Post('submit')
  @ApiOperation({ summary: 'Submit gasless transaction via Gelato ERC2771' })
  @ApiResponse({ status: 201, type: RelayResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error or insufficient balance' })
  @ApiResponse({ status: 403, description: 'Address restricted by compliance policy' })
  @UseGuards(SanctionsGuard)
  async submit(@Body() dto: SubmitRelayDto): Promise<RelayResponseDto> {
    const normalizedDto = {
      ...dto,
      target: normalizeAddress(dto.target),
      userAddress: normalizeAddress(dto.userAddress),
    };
    return this.relayService.submit(normalizedDto);
  }

  @Post('signature')
  @ApiOperation({ summary: 'Oracle signs bet parameters (pre-relay)' })
  @ApiResponse({ status: 200, description: 'Signature generated' })
  @ApiResponse({ status: 400, description: 'Invalid address or parameters' })
  async getSignature(@Body() dto: OracleSignatureDto) {
    return this.relayService.generateOracleSignature(dto);
  }

  @Post('status')
  @ApiOperation({ summary: 'Check relay task status' })
  @ApiResponse({ status: 200, description: 'Task status' })
  async getStatus(@Body() dto: TaskStatusDto) {
    return this.relayService.getTaskStatus(dto.taskId);
  }
}

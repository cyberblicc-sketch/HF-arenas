import { Module } from '@nestjs/common';
import { PrismaModule } from '@arena/shared-prisma';
import { SumsubProvider } from './providers/sumsub.provider';
import { SanctionsProvider } from './providers/sanctions.provider';
import { SanctionsGuard } from './guards/sanctions.guard';
import { SumsubController } from './webhooks/sumsub.controller';

@Module({
  imports: [PrismaModule],
  providers: [SumsubProvider, SanctionsProvider, SanctionsGuard],
  controllers: [SumsubController],
  exports: [SanctionsProvider, SanctionsGuard],
})
export class ComplianceModule {}

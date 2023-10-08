import { AuthGuard } from '@nestjs/passport';

export class RecoveryGuard extends AuthGuard('recovery') {}

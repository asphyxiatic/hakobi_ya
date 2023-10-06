import { Controller, Get, UseGuards } from '@nestjs/common';
import { StreetsService } from '../services/streets.service.js';
import { StreetEntity } from '../entities/street.entity.js';
import { AtGuard } from '../../auth/guards/at.guard.js';

@Controller('streets')
export class StreetsController {
  constructor(private readonly streetsService: StreetsService) {}

  @Get()
  @UseGuards(AtGuard)
  async getFullStreetInformation(): Promise<StreetEntity[]> {
    return this.streetsService.getFullStreetInformation();
  }
}

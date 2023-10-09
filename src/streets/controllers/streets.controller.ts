import { Controller, Get, UseGuards } from '@nestjs/common';
import { StreetsService } from '../services/streets.service.js';
import { StreetEntity } from '../entities/street.entity.js';
import { HttpAtGuard } from '../../auth/guards/http-at.guard.js';

@Controller('streets')
export class StreetsController {
  constructor(private readonly streetsService: StreetsService) {}

  @UseGuards(HttpAtGuard)
  @Get()
  async getFullStreetInformation(): Promise<StreetEntity[]> {
    return this.streetsService.getFullStreetInformation();
  }
}

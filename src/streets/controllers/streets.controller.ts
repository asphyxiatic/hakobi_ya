import { Controller, Get, UseGuards } from '@nestjs/common';
import { StreetsService } from '../services/streets.service.js';
import { HttpAtGuard } from '../../auth/guards/http-at.guard.js';
import { StreetResponse } from '../interfaces/street-response.interface.js';

@Controller('streets')
export class StreetsController {
  constructor(private readonly streetsService: StreetsService) {}

  @UseGuards(HttpAtGuard)
  @Get()
  async getFullStreetInformation(): Promise<StreetResponse[]> {
    return this.streetsService.getAllStreet();
  }
}

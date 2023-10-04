import { Module } from '@nestjs/common';
import { WriteAddressesService } from './services/write-addresses.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity.js';
import { AddressesController } from './controllers/addresses.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  controllers: [AddressesController],
  providers: [WriteAddressesService],
})
export class AddressesModule {}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { BaseEntity } from '../common/entities/base.entity.js';
import { AddressEntity } from '../addresses/entities/address.entity.js';
import { EntranceEntity } from '../entrances/entities/entrance.entity.js';

const tableName = 'houses';

@Entity(tableName)
export class HouseEntity extends BaseEntity {
  @Column({ name: 'house_name', type: 'varchar', nullable: false })
  houseName!: string;

  @Column({ name: 'address_id', type: 'uuid', nullable: false })
  addressId!: string;

  @OneToMany(() => EntranceEntity, (entrance) => entrance.house)
  entrances!: Relation<EntranceEntity[]>;

  @ManyToOne(() => AddressEntity, (address) => address.houses, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'address_id' })
  address!: Relation<AddressEntity>;
}

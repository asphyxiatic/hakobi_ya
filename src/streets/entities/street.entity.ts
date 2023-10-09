import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity.js';
import { UserEntity } from '../../users/entities/user.entity.js';
import { HouseEntity } from '../../houses/entities/house.entity.js';

const tableName = 'streets';

@Entity(tableName)
export class StreetEntity extends BaseEntity {
  @Column({
    name: 'name_street',
    type: 'varchar',
    nullable: false,
  })
  nameStreet!: string;

  @OneToMany(() => HouseEntity, (house) => house.street)
  houses!: Relation<HouseEntity[]>;
}

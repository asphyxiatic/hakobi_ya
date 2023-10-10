import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity.js';
import { StreetEntity } from '../../streets/entities/street.entity.js';
import { EntranceEntity } from '../../entrances/entities/entrance.entity.js';

const tableName = 'houses';

@Entity(tableName)
export class HouseEntity extends BaseEntity {
  @Column({ name: 'house_name', type: 'varchar', nullable: false })
    houseName!: string;

  @Column({ name: 'street_id', type: 'uuid', nullable: false })
    streetId!: StreetEntity['id'];

  @OneToMany(() => EntranceEntity, (entrance) => entrance.house)
    entrances!: Relation<EntranceEntity[]>;

  @ManyToOne(() => StreetEntity, (street) => street.houses, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'street_id' })
    street!: Relation<StreetEntity>;
}

import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity.js';
import { HouseEntity } from '../../houses/house.entity.js';

const tableName = 'entrances';

@Entity(tableName)
export class EntranceEntity extends BaseEntity {
  @Column({ name: 'number_entrance', type: 'integer', nullable: false })
  numberEntrance!: number;

  @Column({ type: 'boolean', nullable: false })
  completed!: boolean;

  @Column({ name: 'house_id', type: 'uuid', nullable: false })
  houseId!: string;

  @ManyToOne(() => HouseEntity, (house) => house.entrances, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'house_id' })
  house!: Relation<HouseEntity>;
}

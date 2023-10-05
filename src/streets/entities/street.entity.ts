import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';
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
    unique: true,
  })
  nameStreet!: string;

  @Column({ name: 'owner_id', type: 'uuid', nullable: false })
  ownerId!: UserEntity['id'];

  @OneToMany(() => HouseEntity, (house) => house.street)
  houses!: Relation<HouseEntity[]>;

  @ManyToOne(() => UserEntity, (user) => user.streets, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  user!: Relation<UserEntity>;
}

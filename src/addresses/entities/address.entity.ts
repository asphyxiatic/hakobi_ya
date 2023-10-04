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

const tableName = 'addresses';

@Entity(tableName)
export class AddressEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
  name!: string;

  @Column({ name: 'owner_id', type: 'uuid', nullable: false })
  ownerId!: UserEntity['id'];

  @OneToMany(() => HouseEntity, (house) => house.address)
  houses!: Relation<HouseEntity[]>;

  @ManyToOne(() => UserEntity, (user) => user.addresses, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  user!: Relation<UserEntity>;
}

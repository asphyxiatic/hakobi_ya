import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity.js';
import { userRoles } from '../types/user-roles.js';
import { AddressEntity } from '../../addresses/entities/address.entity.js';

const tableName = 'users';

@Entity(tableName)
export class UserEntity extends BaseEntity {
  @Column({ name: 'first_name', type: 'varchar', nullable: false })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', nullable: false })
  lastName!: string;

  @Column({ name: 'role', type: 'enum', enum: userRoles, nullable: false })
  role!: string;

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses!: Relation<AddressEntity[]>;
}

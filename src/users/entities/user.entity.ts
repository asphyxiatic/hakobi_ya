import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity.js';
import { userRoles } from '../types/user-roles.js';
import { AddressEntity } from '../../addresses/entities/address.entity.js';
import { TokenEntity } from '../../tokens/entities/token.entity.js';

const tableName = 'users';

@Entity(tableName)
export class UserEntity extends BaseEntity {
  @Column({ name: 'first_name', type: 'varchar', nullable: false })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', nullable: false })
  lastName!: string;

  @Column({ type: 'varchar', nullable: false })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @Column({ name: 'role', type: 'enum', enum: userRoles, nullable: false })
  role!: string;

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens!: Relation<TokenEntity[]>;

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses!: Relation<AddressEntity[]>;
}

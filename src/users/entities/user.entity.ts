import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity.js';
import { UserRole, userRoles } from '../types/user-roles.js';
import { AddressEntity } from '../../addresses/entities/address.entity.js';
import { TokenEntity } from '../../tokens/entities/token.entity.js';

const tableName = 'users';

@Entity(tableName)
export class UserEntity extends BaseEntity {
  @Column({ name: 'login', type: 'varchar', nullable: false, unique: true })
  login!: string;

  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @Column({
    name: 'role',
    type: 'enum',
    enum: userRoles,
    default: 'regular' as UserRole,
    nullable: false,
  })
  role!: string;

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens!: Relation<TokenEntity[]>;

  @OneToMany(() => AddressEntity, (address) => address.user)
  addresses!: Relation<AddressEntity[]>;
}

import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity.js';
import { TokenEntity } from '../../tokens/entities/token.entity.js';
import { StreetEntity } from '../../streets/entities/street.entity.js';
import { Role } from '../enums/role.enum.js';
import { RoleType } from '../types/role.type.js';

const tableName = 'users';

@Entity(tableName)
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: true, default: null, unique: true })
  email!: string | null;

  @Column({ name: 'login', type: 'varchar', nullable: false, unique: true })
  login!: string;

  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  active!: boolean;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.user,
  })
  role!: RoleType;

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens!: Relation<TokenEntity[]>;

  @OneToMany(() => StreetEntity, (street) => street.user)
  streets!: Relation<StreetEntity[]>;
}

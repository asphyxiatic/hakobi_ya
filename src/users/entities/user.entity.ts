import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity.js';
import { TokenEntity } from '../../tokens/entities/token.entity.js';
import { Role } from '../enums/role.enum.js';

const tableName = 'users';

@Entity(tableName)
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: false, unique: true })
    login!: string;

  @Column({ type: 'varchar', nullable: false })
    password!: string;

  @Column({ type: 'boolean', default: false, nullable: false })
    online!: boolean;

  @Column({
    name: 'recovery_token',
    type: 'varchar',
    default: null,
    nullable: true,
  })
    recoveryToken!: string | null;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.user],
  })
    roles!: Role[];

  @OneToMany(() => TokenEntity, (token) => token.user)
    tokens!: Relation<TokenEntity[]>;
}

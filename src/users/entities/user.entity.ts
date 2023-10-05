import { Column, Entity, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity.js';
import { TokenEntity } from '../../tokens/entities/token.entity.js';
import { StreetEntity } from '../../streets/entities/street.entity.js';

const tableName = 'users';

@Entity(tableName)
export class UserEntity extends BaseEntity {
  @Column({ name: 'login', type: 'varchar', nullable: false, unique: true })
  login!: string;

  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @Column({ type: 'boolean', default: true, nullable: false })
  active!: boolean;

  @OneToMany(() => TokenEntity, (token) => token.user)
  tokens!: Relation<TokenEntity[]>;

  @OneToMany(() => StreetEntity, (street) => street.user)
  streets!: Relation<StreetEntity[]>;
}

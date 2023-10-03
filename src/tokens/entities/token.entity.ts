import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity.js';
import { UserEntity } from '../../users/entities/user.entity.js';

const tableName = 'tokens';

@Entity(tableName)
export class TokenEntity extends BaseEntity {
  @Column('varchar')
  value!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: UserEntity['id'];

  @Column({ name: 'fingerprint', type: 'varchar' })
  fingerprint!: string;

  @ManyToOne(() => UserEntity, (user) => user.tokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: Relation<UserEntity>;
}

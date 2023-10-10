import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id!: string;

  @CreateDateColumn({ name: 'created_at' })
    createdAt!: string;

  @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: string;
}

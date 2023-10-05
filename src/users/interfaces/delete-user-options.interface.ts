import { UserEntity } from '../entities/user.entity.js';

export interface DeleteUsersOptions {
  userIds: UserEntity['id'][];
}

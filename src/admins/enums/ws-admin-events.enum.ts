export enum WsIncomingAdminEvent {
  CREATE_STREET = 'create_street',
  UPDATE_STREET = 'update_street',
  DELETE_STREETS = 'delete_streets',
  REGISTER_USER = 'register_user',
  CREATE_HOUSE = 'create_house',
  DELETE_HOUSES = 'delete_houses',
  UPDATE_HOUSE = 'update_house',
  ENABLE_ACTIVITY_USER = 'enable_activity_user',
  DISABLE_ACTIVITY_USER = 'disable_activity_user',
  UPDATE_USER = 'update_user',
  DELETE_USERS = 'delete_users',
}

export enum WsOutgoingAdminEvent {
  CREATE_STREET = 'create_street',
  UPDATE_STREET = 'update_street',
  DELETE_STREETS = 'delete_streets',
  REGISTER_USER = 'register_user',
  REGISTER_USER_CREDENTIALS = 'user_credentials',
  CREATE_HOUSE = 'create_house',
  DELETE_HOUSES = 'delete_houses',
  UPDATE_HOUSE = 'update_house',
  ENABLE_ACTIVITY_USER = 'enable_activity_user',
  DISABLE_ACTIVITY_USER = 'disable_activity_user',
  UPDATE_USER = 'update_user',
  DELETE_USERS = 'delete_users',
}

export interface RegisterUserResponse {
  id: string;

  credentials: {
    login: string;
    password: string;
  };
}

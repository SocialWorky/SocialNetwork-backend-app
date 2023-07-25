export class CreateUser {
  _id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isVerified: boolean;
  isActive: boolean;
  token: string;
  avatar: string;
}
export class UpdateUser {
  username?: string;
  name?: string;
  lastName?: string;
  password?: string;
  isAdmin?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  token?: string;
  avatar?: string;
}
export class LoginDto {
  email: string;
  password: string;
}

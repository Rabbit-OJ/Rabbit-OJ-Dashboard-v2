export interface LoginResponseUser {
  uid: number;
  username: string;
  isAdmin: boolean;
}

export interface MiniUser extends LoginResponseUser {
  isLogin: boolean;
}

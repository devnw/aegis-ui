export class User {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  isdisabled: boolean;
}

export class UserRequest {
  user: User;
}

export class PermissionRequest {
  permissions: string[];
}
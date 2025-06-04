import { ApiProperty } from '@nestjs/swagger';
import { Users } from '../../users/users.model';


export class AuthDto {
  @ApiProperty({example: 'j.w.t', description: 'JWT'})
  readonly token: string;
  // @ApiProperty({example: 'ralph', description: 'Логин пользователя'})
  // readonly user: {
  //   createdAt: "2025-05-24T15:52:30.417Z"
  //   id: 1,
  //   login: "admin",
  //   password: "$2b$05$BriMGJ$i4jdILRQMXRVa//./AgdGLGJN4894n3gL901iNnRe",
  //   role: "ADMIN",
  //   updatedAt: "2025-05-25T07:31:20.266Z"
  // };
  @ApiProperty({example: Users, description: 'Данные пользователя'})
  readonly user: Users;
}
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { Users } from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { OfficesModule } from './offices/offices.module';
import { BookingModule } from './booking/booking.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Office } from './offices/office.model';
import { Booking } from './booking/booking.model';
import { Workplace } from './offices/workplace.model';
import { Floor } from './offices/floor.model';


@Module({
  controllers: [],
  providers: [],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static'
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: String(process.env.POSTGRES_HOST),
      port: Number(process.env.POSTGRES_PORT),
      username: String(process.env.POSTGRES_USER),
      password: String(process.env.POSTGRES_PASSWORD),
      database: String(process.env.POSTGRES_DB),
      models: [Users, Office, Floor, Workplace, Booking],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    OfficesModule,
    BookingModule,
    FilesModule,
  ]
})
export class AppModule {}
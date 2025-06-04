import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { Users } from './users/users.model';
import { AuthModule } from './auth/auth.module';
import { OfficesModule } from './offices/offices.module';
import { BookingModule } from './booking/booking.module';


@Module({
  controllers: [],
  providers: [],
  imports: [
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
      models: [Users],
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    OfficesModule,
    BookingModule,
  ]
})
export class AppModule {}
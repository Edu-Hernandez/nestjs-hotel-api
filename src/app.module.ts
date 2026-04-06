import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PropertyModule } from './property/property.module';
import { PrismaModule } from './shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule, PropertyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

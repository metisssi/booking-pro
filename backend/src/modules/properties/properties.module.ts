import { Module } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesController } from './properties.controller';
import { RolesGuard } from '../../common/guards/roles.guard'; 


@Module({
  controllers: [PropertiesController],
  providers: [PropertiesService, RolesGuard],
})
export class PropertiesModule {}

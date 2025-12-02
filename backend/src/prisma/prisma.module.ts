import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Делает модуль глобальным (доступен везде)
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Экспортируем чтобы другие модули могли использовать
})
export class PrismaModule {}
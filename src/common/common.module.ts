import { Global, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { CommonService } from './common.service';

@Global()
@Module({
  imports: [UsersModule],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}

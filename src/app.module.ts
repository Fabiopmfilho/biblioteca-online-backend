import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [BooksModule, LoansModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

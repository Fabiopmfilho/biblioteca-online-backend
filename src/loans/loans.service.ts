/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateLoanDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: data.bookId },
    });
    if (!book) throw new NotFoundException('Livro não encontrado');

    if (book.borrowed >= book.totalCopies) {
      throw new Error('Não há exemplares disponíveis');
    }

    // Cria empréstimo e atualiza quantidade emprestada
    const loan = await this.prisma.loan.create({ data });

    await this.prisma.book.update({
      where: { id: data.bookId },
      data: { borrowed: { increment: 1 } },
    });

    return loan;
  }

  findAll() {
    return this.prisma.loan.findMany({
      include: { book: true },
      orderBy: { loanDate: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.loan.findUnique({
      where: { id },
      include: { book: true },
    });
  }

  async update(id: string, data: UpdateLoanDto) {
    // Se o campo "returned" for true, marque a data de devolução
    if (data.returned === true) {
      data.returnDate = new Date();

      // Atualiza quantidade emprestada no livro
      const loan = await this.prisma.loan.findUnique({ where: { id } });
      if (loan && !loan.returned) {
        await this.prisma.book.update({
          where: { id: loan.bookId },
          data: { borrowed: { decrement: 1 } },
        });
      }
    }

    return this.prisma.loan.update({ where: { id }, data });
  }

  remove(id: string) {
    return this.prisma.loan.delete({ where: { id } });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  create(createBookDto: CreateBookDto) {
    // Mapear os campos corretamente para a entidade Book
    const book = this.bookRepository.create({
      class_id: createBookDto.classId,
      // user_id deve ser preenchido pelo backend, se necessário
      // created_at será preenchido automaticamente
    });
    return this.bookRepository.save(book);
  }

  findAll() {
    return this.bookRepository.find();
  }

  findOne(id: number) {
    return this.bookRepository.findOneBy({ id });
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    // Garantir que só os campos válidos sejam atualizados
    const updateData: Partial<Book> = {};
    if (updateBookDto.classId !== undefined) updateData.class_id = updateBookDto.classId;
    // user_id não é atualizado pelo DTO
    return this.bookRepository.update(id, updateData);
  }

  remove(id: number) {
    return this.bookRepository.delete(id);
  }
} 
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingsService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('api/bookings')
export class BookController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('test')
  getTest(): string {
    return 'Book route is working!';
  }

  
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async book(@Body() dto: CreateBookDto, @Req() req) {
    const result = await this.bookingsService.book(dto.classId, req.user.id);
    return { message: result.message, booking: result.booking };
  }


  @Get('frequency')
  async frequency(
    @Query('userId') userId: number,
    @Query('start') start: string,
    @Query('end') end: string
  ) {
    return this.bookingsService.getUserFrequency(userId, start, end);
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getUserBookings(@Req() req) {
    console.log('REQ.USER BACKEND:', req.user);
    return this.bookingsService.findByUserId(req.user.id);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookingsService.update(+id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}

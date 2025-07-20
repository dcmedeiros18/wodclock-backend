import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Controller('api/bookings')
export class BookController {
  constructor(private readonly bookingsService: BookService) {}

  // ===== TEST ROUTE TO CHECK IF CONTROLLER IS RESPONDING =====
  @Get('test')
  getTest(): string {
    return 'Book route is working!';
  }

  // ===== BOOK A CLASS (REQUIRES JWT AUTH) =====
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async book(@Body() dto: CreateBookDto, @Req() req) {
    // Book the class for the logged-in user
    const result = await this.bookingsService.book(dto.classId, req.user.id);
    return {
      message: result.message,
      booking: result.booking,
    };
  }

  // ===== GET USER BOOKING FREQUENCY BY DATE RANGE =====
  @Get('frequency')
  async frequency(
    @Query('userId') userId: number,
    @Query('start') start: string,
    @Query('end') end: string
  ) {
    // Fetch booking frequency for the specified user and date range
    return this.bookingsService.getUserFrequency(userId, start, end);
  }

  // ===== GET BOOKINGS FOR LOGGED-IN USER =====
  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getUserBookings(
    @Req() req,
    @Query('start') start?: string,
    @Query('end') end?: string
  ) {
    // Fetch bookings for the authenticated user (optionally filtered by date range)
    return this.bookingsService.findByUserId(req.user.id, start, end);
  }

  // ===== GET ALL BOOKINGS (ADMIN ONLY OR OPEN ACCESS) =====
  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  // ===== GET BOOKING BY ID =====
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  // ===== UPDATE A BOOKING BY ID =====
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookingsService.update(+id, updateBookDto);
  }

  // ===== DELETE A BOOKING BY ID =====
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(+id);
  }
}

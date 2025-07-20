import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Endpoint to create a new user.
   * Receives user data in the request body and returns the created user.
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    console.log('Received on backend:', createUserDto);
    return this.userService.create(createUserDto);
  }

  /**
   * Endpoint to retrieve all users.
   * Returns an array of users from the database.
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * Endpoint to retrieve a single user by ID.
   * @param id - ID of the user
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  /**
   * Endpoint to update an existing user by ID.
   * Receives updated user data and returns the result of the update operation.
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  /**
   * Endpoint to delete a user by ID.
   * @param id - ID of the user to be removed
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

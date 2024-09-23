import { Controller, Get, Post, Patch, Delete, Param, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // Route to get a specific user by ID
  @Get('getuser/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  // Route to create a new user
  @Post('createuser')
  async createUser(@Body() data: any): Promise<User> {
    return this.userService.createUser(data);
  }

  // Route to update an existing user by ID
  @Patch('updateuser/:id')
  async updateUser(@Param('id') id: string, @Body() data: any): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  // Route to delete a user by ID
  @Delete('deleteuser/:id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser(id);
  }

  // Route to validate user credentials (for login)
  @Post('login')
  async login(@Body() { email, password }: { email: string; password: string }): Promise<{ token: string; user: User }> {
    const user = await this.userService.loginUser(email, password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}

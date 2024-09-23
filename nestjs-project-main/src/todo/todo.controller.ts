import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { TodoService } from './todo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Import the guard
import { Request } from 'express';

@Controller('api/todo')
@UseGuards(JwtAuthGuard)

export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  // Route to get all todos
  @Get('getalltodos')
  getAllTodos() {
    return this.todoService.getTodos();
  }

  // Route to get a specific todo by ID
  @Get('gettodo/:id')
  getTodoById(@Param('id') id: string) {
    return this.todoService.getTodoById(id);
  }

  @Post('createtodo')
  createTodo(@Body() data: any, @Req() req: any) {
    const user = req.user; // Extract the user from the request
    return this.todoService.createTodo(data, user); // Pass user to the service
  }

  // Route to update an existing todo by ID
  @Patch('updatetodo/:id')
  updateTodo(@Param('id') id: string, @Body() data: any) {
    return this.todoService.updateTodo(id, data);
  }

  // Route to delete a todo by ID
  @Delete('deletetodo/:id')
  deleteTodo(@Param('id') id: string) {
    return this.todoService.deleteTodo(id);
  }
}

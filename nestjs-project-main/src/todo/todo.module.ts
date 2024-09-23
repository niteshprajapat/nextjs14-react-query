import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { Todo, TodoSchema } from './todo.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
    ],
    controllers: [TodoController],
    providers: [TodoService, JwtAuthGuard, AuthService],
})
export class TodoModule { }

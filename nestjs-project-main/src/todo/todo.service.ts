import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo, TodoDocument } from './todo.schema';

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) { }

  async getTodos(): Promise<Todo[]> {
    try {
      return await this.todoModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve todos');
    }
  }

  async getTodoById(id: string): Promise<Todo> {
    try {
      const todo = await this.todoModel.findById(id).exec();
      if (!todo) {
        throw new BadRequestException('Todo not found');
      }
      return todo;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve todo by ID');
    }
  }

  async createTodo(data: any, user: any): Promise<Todo> {
    try {
      console.log('Checking if todo with the same title already exists...'); // Log checking for existing todo
      // Check if a todo with the same title already exists
      const existingTodo = await this.todoModel.findOne({ title: data.title }).exec();

      if (existingTodo) {
        console.log('Todo with this title already exists:', data.title); // Log existing todo
        throw new BadRequestException('A todo with this title already exists');
      }

      console.log('Creating a new todo...'); // Log creating new todo
      // Create and save the new todo if the title does not exist
      const newTodo = new this.todoModel({
        title: data.title,
        description: data.description,
        completed: false,
        user: user._id
      });

      const savedTodo = await newTodo.save();
      console.log('New todo created successfully:', savedTodo); // Log successful creation

      return savedTodo;
    } catch (error) {
      console.error('Error creating todo:', error.message); // Log the error
      throw new InternalServerErrorException('Failed to create todo');
    }
  }

  async updateTodo(id: string, data: any): Promise<Todo> {
    try {
      const updatedTodo = await this.todoModel.findByIdAndUpdate(id, data, { new: true }).exec();
      if (!updatedTodo) {
        throw new BadRequestException('Todo not found');
      }
      return updatedTodo;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update todo');
    }
  }

  async deleteTodo(id: string): Promise<Todo> {
    try {
      const deletedTodo = await this.todoModel.findByIdAndDelete(id).exec();
      if (!deletedTodo) {
        throw new BadRequestException('Todo not found');
      }
      return deletedTodo;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete todo');
    }
  }

}

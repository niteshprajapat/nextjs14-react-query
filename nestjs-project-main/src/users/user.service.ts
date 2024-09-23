import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth/auth.service'; // Import AuthService

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly authService: AuthService, // Inject AuthService
  ) { }

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve user by ID');
    }
  };

  async createUser(data: any): Promise<User> {
    try {
      const { email, password } = data;
      const existingUser = await this.userModel.findOne({ email }).exec();
      if (existingUser) {
        console.log('User already exists with email:', email);
        throw new BadRequestException('A user with this email already exists');
      }
      console.log('Hashing password');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log('Password hashed successfully');

      const newUser = new this.userModel({
        ...data,
        password: hashedPassword,
      });

      console.log('Saving new user');
      const savedUser = await newUser.save();

      console.log('User created successfully:', savedUser);
      return savedUser;
    }

    catch (error) {
      // Log and re-throw known exceptions
      if (error instanceof BadRequestException) {
        // console.error('User creation error:', error.message); 
        throw error;
      } else {
        // For internal errors, throw a generic message
        console.error('Error creating user:', error); // Log the detailed error
        throw new InternalServerErrorException('Failed to create user');
      }
    }
  };

  async updateUser(id: string, data: any): Promise<User> {
    try {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update user');
    }
  };

  async deleteUser(id: string): Promise<User> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
      if (!deletedUser) {
        throw new NotFoundException('User not found');
      }
      return deletedUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete user');
    }
  };

  async loginUser(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const user = await this.userModel.findOne({ email }).exec();

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Generate JWT token
      const payload = { email: user.email, _id: user._id };
      const token = this.authService.generateToken(payload);

      return { token, user };
    } catch (error) {
      throw new InternalServerErrorException('Failed to validate user');
    }
  }
}

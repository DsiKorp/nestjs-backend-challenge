import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly users: User[] = [];

  findAll(): Promise<User[]> {
    return Promise.resolve([...this.users]);
  }

  findById(id: string): Promise<User | null> {
    const user = this.users.find((item) => item.id === id) ?? null;
    return Promise.resolve(user);
  }

  findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((item) => item.email === email) ?? null;
    return Promise.resolve(user);
  }

  create(data: CreateUserDto): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      createdAt: new Date(),
    };

    this.users.push(user);
    return Promise.resolve(user);
  }
}

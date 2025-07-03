export interface User {
  id: string;
  name: string;
  surname: string;
  nationality: string;
  dateOfBirth: string; // ISO format
  dateCreated: string; // ISO format
}

import { KafkaProducer } from './KafkaProducer';

export class UserService {
    
  private producer: KafkaProducer;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }

  async createUser(userData: Omit<User, 'id' | 'dateCreated'>): Promise<User> {
    const user: User = {
      id: this.generateId(),
      ...userData,
      dateCreated: new Date().toISOString(),
    };
    await this.producer.sendMessage({ event: 'user_created', user });
    return user;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

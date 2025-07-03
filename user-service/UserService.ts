import { KafkaProducer } from './KafkaProducer';
import { Logger } from '../common/utils/Logger';
import { IUser } from './interfaces/IUser';

export class UserService {
    
  private producer: KafkaProducer;

  constructor(producer: KafkaProducer) {
    this.producer = producer;
  }

  async createUser(userData: Omit<IUser, 'id' | 'dateCreated'>): Promise<IUser> {
    try {
      const user: IUser = {
        id: this.generateId(),
        ...userData,
        dateCreated: new Date(),
      };
      await this.producer.sendMessage({ event: 'user_created', user: this.serializeUser(user) });
      Logger.info('User created and event emitted:', user);
      return user;
    } catch (error) {
      Logger.error('Failed to create user or emit event:', error);
      throw error;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Helper to serialize User for transport (convert Date to ISO string)
  private serializeUser(user: IUser): any {
    return {
      ...user,
      dateOfBirth: user.dateOfBirth.toISOString(),
      dateCreated: user.dateCreated.toISOString(),
    };
  }
}

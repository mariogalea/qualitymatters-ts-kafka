import { KafkaProducer } from './KafkaProducer';
import { UserService } from './UserService';
import { IUser } from './interfaces/IUser';

export class UserApp {

  private producer: KafkaProducer;
  private userService: UserService;

  constructor(broker: string, topic: string) {
    this.producer = new KafkaProducer(broker, topic);
    this.userService = new UserService(this.producer);
  }

  async run() {

    await this.producer.connect();

    const userData = {
      name: 'Mario',
      surname: 'Galea',
      nationality: 'Maltese',
      dateOfBirth: new Date('1984-06-01'), 
    };

    const newUser: IUser = await this.userService.createUser(userData);

    // Keep the service running
    console.log('User service is running. Press Ctrl+C to exit.');
    // Prevent Node.js from exiting
    process.stdin.resume(); 
  }

}

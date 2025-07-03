import { KafkaProducer } from './KafkaProducer';
import { UserService, User } from './UserService';

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
      dateOfBirth: '1990-01-01',
    };

    const newUser: User = await this.userService.createUser(userData);

    await this.producer.disconnect();
  }

}

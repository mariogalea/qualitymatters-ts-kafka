import { KafkaProducer } from './KafkaProducer';
import { UserService } from './UserService';
import { IUser } from './interfaces/IUser';
import { Logger } from '../common/utils/Logger';


export class UserApp {

  private producer: KafkaProducer;
  private userService: UserService;

  constructor(broker: string, topic: string) {

    this.producer = new KafkaProducer(broker, topic);
    this.userService = new UserService(this.producer);
    Logger.debug(`UserApp initialized with broker '${broker}' and topic '${topic}'`);
  }

  async run() {

      await this.producer.connect();
      Logger.debug('Connected to Kafka broker.');
      let count = 0;

      const maxUsers = 60; 

      const interval = setInterval(async () => {
          if (count >= maxUsers) {
              clearInterval(interval);
              Logger.info('Finished creating users.');
              Logger.info('User service is still running. Press Ctrl+C to exit.');
              process.stdin.resume();
              return;
          }

          const userData = {
              name: `User${count + 1}`,
              surname: 'Galea',
              nationality: 'Maltese',
              dateOfBirth: new Date('1984-06-01'),
          };

          try {
              const newUser: IUser = await this.userService.createUser(userData);
              Logger.info(`Created user: ${newUser.name}`);
          } catch (error) {
              Logger.error('Error creating user:', error);
          }

          count++;
      }, 5000);

      Logger.info('User service is running. Press Ctrl+C to exit.');
      process.stdin.resume();
  }

}
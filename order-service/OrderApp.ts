import { KafkaConsumer } from './KafkaConsumer';
import { KafkaProducer } from './KafkaProducer'
import { OrderService } from './OrderService';
import { Logger } from '../common/utils/Logger';

export class OrderApp {

    private producer: KafkaProducer;
    private consumer: KafkaConsumer;
    private orderService: OrderService;

    constructor(broker: string, userTopic: string, orderTopic: string) {

      this.producer = new KafkaProducer(broker, orderTopic);
      this.consumer = new KafkaConsumer(broker, userTopic, 'orderservicegroup');
      this.orderService = new OrderService(this.producer);
      Logger.debug(`OrderApp initialized with broker '${broker}', user topic '${userTopic}', and order topic '${orderTopic}'`);
    }

    async run() {
      Logger.debug('Starting Order service...');
      await this.producer.connect();
      await this.consumer.connect();
      await this.consumer.subscribe(async (msg) => {
        if (msg.event === 'usercreated' && msg.user?.id) {
          await this.orderService.createOrder(msg.user.id);
        }
      });

      Logger.info('Order service is running and listening for usercreated events.');
      process.stdin.resume();
    }

}
import { KafkaConsumer } from './KafkaConsumer';
import { KafkaProducer } from './KafkaProducer'
import { OrderService } from './OrderService';
import { Logger } from '../common/utils/Logger';

export class OrderApp {
  private consumer: KafkaConsumer;
  private orderService: OrderService;

  constructor(broker: string, userTopic: string, orderTopic: string) {
    const producer = new KafkaProducer(broker, orderTopic);
    this.consumer = new KafkaConsumer(broker, userTopic, 'order-service-group');
    this.orderService = new OrderService(producer);
  }

  async run() {
    await this.consumer.connect();
    await this.consumer.subscribe(async (msg) => {
      if (msg.event === 'usercreated' && msg.user?.id) {
        await this.orderService.createOrder(msg.user.id);
      }
    });
    Logger.info('Order service is running and listening for usercreated events.');
  }
}
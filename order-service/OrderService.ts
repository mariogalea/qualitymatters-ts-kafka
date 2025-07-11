import { KafkaProducer } from './KafkaProducer';
import { IOrder } from './interfaces/IOrder';
import { Logger } from '../common/utils/Logger';

export class OrderService {

    private producer: KafkaProducer;

    constructor(producer: KafkaProducer) {
        this.producer = producer;
    }

    async createOrder(userId: string): Promise<IOrder> {

        const order: IOrder = {
            id: Math.random().toString(36).substr(2, 9),
            userId,
            product: 'Sample Product',
            quantity: 1,
            dateCreated: new Date(),
        };

        await this.producer.sendMessage({ event: 'ordercreated', order: this.serializeOrder(order) });
        
        Logger.info('Order created and event emitted:', order);
        
        return order;
    
    }

    // Helper to serialize Order for transport (convert Date to ISO string)
    private serializeOrder(order: IOrder): any {
        return {
            ...order,
            dateCreated: order.dateCreated.toISOString(),
        };
    }
}
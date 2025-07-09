import { OrderApp } from './OrderApp';

const broker = 'localhost:9092';
const userTopic = 'usercreated';
const orderTopic = 'ordercreated';

// Initialize the OrderApp with the Kafka broker, user topic, and order topic
// This app will consume messages from the 'usercreated' topic and create orders, which will be sent to the 'ordercreated' topic
const app = new OrderApp(broker, userTopic, orderTopic);
app.run().catch(console.error);
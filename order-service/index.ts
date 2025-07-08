import { OrderApp } from './OrderApp';

const broker = 'localhost:9092';
const userTopic = 'usercreated';
const orderTopic = 'ordercreated';

const app = new OrderApp(broker, userTopic, orderTopic);
app.run().catch(console.error);
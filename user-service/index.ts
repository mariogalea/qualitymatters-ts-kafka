import { UserApp } from './UserApp';

const broker = 'localhost:9092';
const topic = 'usercreated';

const app = new UserApp(broker, topic);
app.run().catch(console.error);

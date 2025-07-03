import { UserApp } from './UserApp';

const broker = 'localhost:9092'; // Change if needed
const topic = 'user_created';

const app = new UserApp(broker, topic);
app.run().catch(console.error);

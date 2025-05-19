import config from './config/configuration.js';
import Server from './Server';

const server = new Server(config);

server.bootstrap();
server.run();

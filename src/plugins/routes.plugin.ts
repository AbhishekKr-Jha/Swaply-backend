import { Plugin, Server } from '@hapi/hapi';

const routesPlugin: Plugin<void> = {
  name: 'routes',
  version: '1.0.0',
  register: (_server: Server) => {
    console.log(_server);
    console.log('✅ Routes plugin registered successfully');
  },
};

export default routesPlugin;

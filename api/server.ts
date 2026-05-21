// @ts-ignore
import server from '../dist/server/server.js';

export default {
  async fetch(request: Request) {
    return server.fetch(request);
  }
};

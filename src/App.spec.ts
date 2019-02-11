import { expect } from 'chai';

import App from '@app/App';
import config from '@app/utils/config';

const { port } = config.get('/server');

describe('App', () => {
  let app: any;

  beforeEach(async () => {
    app = new App();
    await app.start();
  });

  afterEach(() => {
    app.server.close();
  });

  it('should successfully start application', () => {
    const { port: serverPort } = app.server.address();
    expect(`${serverPort}`).to.equal(port);
  });
});

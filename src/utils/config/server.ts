import * as dotenv from 'dotenv';
dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

export default new class ServerConfig {
  public host = process.env.APP_HOST || 'localhost';
  public port = process.env.PORT || 3030;
  public url = process.env.URL || `http://${this.host}:${this.port}`;
}();

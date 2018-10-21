// tslint:disable-next-line no-namespace
declare namespace Express {
  // tslint:disable-next-line interface-name
  export interface Response {
    reply: any;
    message: (message: string | string[]) => Response;
  }
  // tslint:disable-next-line interface-name
  export interface Request {
    user: any;
  }
}

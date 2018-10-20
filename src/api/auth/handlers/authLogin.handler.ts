import { Request, Response } from 'express';

class AuthLoginHandler {
  public route(req: Request, res: Response) {
    const { method, url } = req;
    // tslint:disable-next-line no-console
    console.log(`${method} ${url}`);

    return res.json({
      token: 'some token',
    });
  }
}

export default new AuthLoginHandler();

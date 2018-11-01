import { Request, Response } from 'express';

class AuthVerifyEmailHandler {
  public route(req: Request, res: Response) {
    console.log(req.method);
    // res.send({ text: 'hi' });

    res.render('index', { title: 'Hey', message: 'Hello there!' });
  }
}

export default new AuthVerifyEmailHandler();

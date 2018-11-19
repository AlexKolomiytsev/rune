import { Request, Response } from 'express';

class UsersGetMeHandler {
  public route(req: Request, res: Response) {
    const { user } = req;

    return res.reply(user);
  }
}

export default new UsersGetMeHandler();

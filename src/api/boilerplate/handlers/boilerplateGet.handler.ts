import { Request, Response } from 'express';

class BoilerplateGetHandler {
  public route(req: Request, res: Response) {
    const { user } = req;

    return res.json({
      boilerplate: 'boilerplate UPDATED 4',
      user,
    });
  }
}

export default new BoilerplateGetHandler();

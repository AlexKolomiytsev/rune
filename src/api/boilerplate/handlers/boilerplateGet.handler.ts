import { Request, Response } from 'express';

class BoilerplateGetHandler {
  public route(req: Request, res: Response) {
    const { user } = req;

    // eslint-disable-next-line
    console.log(user);

    return res.json({
      boilerplate: 'boilerplate UPDATED 4',
      user,
    });
  }
}

export default new BoilerplateGetHandler();

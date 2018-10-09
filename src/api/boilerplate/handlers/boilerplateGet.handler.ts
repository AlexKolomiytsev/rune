import { Request, Response } from 'express';

class BoilerplateGetHandler {
  public route(req: Request, res: Response) {
    const { method, url } = req;

    console.log(`${method} ${url}`);

    return res.json({
      boilerplate: 'boilerplate UPDATED 4',
    });
  }

}

export default new BoilerplateGetHandler();

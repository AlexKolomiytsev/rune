// @ts-ignore
import { response, Request, Response, NextFunction } from 'express';
import { isError, isEmpty, castArray } from 'lodash';
import * as boom from 'boom';

const getResponseCode = (method: any, payload: any) => {
  let responseCode = 200;
  if (method === 'POST') responseCode = 201;

  if (method !== 'GET' && (!payload || isEmpty(payload))) responseCode = 204;

  return responseCode;
};

class Responder {
  public static reply(data: any = {}) {
    return (data && data.isBoom) || isError(data)
      ? this.replyWithError(data)
      : this.replySuccessfully(data);
  }

  public static replyWithError(error: any) {
    const boomifiedError = boom.boomify(error, { statusCode: error.isJoi && 400 });
    const { output } = boomifiedError;
    const message = boomifiedError.message || output.payload.message;
    const messages = this.messages || castArray(message);

    return this.status(output.statusCode).json({
      error: output.payload.error,
      data: error.data,
      meta: this.meta || error.details,
      messages,
    });
  }

  public static replySuccessfully(data: any) {
    if (!this.messages || (this.messages && !this.messages.length)) this.messages = ['ok'];
    const status = getResponseCode(this.req.method, data);

    return this.status(status).json({ data, meta: this.meta, messages: this.messages });
  }

  public static message(message: string | string[]) {
    this.messages = castArray(message);

    return this;
  }

  public static meta(meta: any) {
    this.meta = meta;

    return this;
  }

  private static req: Request;
  private static messages: string[];

  private static status(statusCode: number) {
    return response.status(statusCode);
  }
}

export default (_: Request, res: Response, next: NextFunction) => {
  res.reply = Responder.reply.bind(res);
  res.replyWithError = Responder.replyWithError.bind(res);
  res.replySuccessfully = Responder.replySuccessfully.bind(res);
  res.message = Responder.message.bind(res);
  res.meta = Responder.meta.bind(res);

  return next();
};

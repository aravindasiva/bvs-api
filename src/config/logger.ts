import type { FastifyServerOptions } from "fastify";

const redact = [
  "req.headers.authorization",
  "req.headers.cookie",
  "headers.authorization",
  "headers.cookie",
  "body.password",
  "body.token",
];

export const genReqId: FastifyServerOptions["genReqId"] = () =>
  Math.random().toString(36).slice(2, 8);

export function createLogger(isProd: boolean): FastifyServerOptions["logger"] 
{
  return isProd
    ? { level: "info", redact }
    : {
        level: "debug",
        redact,
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss.l",
            ignore: "pid,hostname",
            singleLine: true,
          },
        },
      };
}

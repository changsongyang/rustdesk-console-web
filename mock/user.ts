import type { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

let access = '';

const getAccess = () => {
  return access;
};

export default {
  'POST /api/login': async (req: Request, res: Response) => {
    const { password, username } = req.body;
    await waitTime(500);
    if (password === 'admin123' && username === 'admin') {
      res.send({
        access_token: 'mock-jwt-token-admin',
        type: 'access_token',
        user: {
          name: 'admin',
          email: 'admin@example.com',
          note: 'Default administrator account',
          status: 1,
          is_admin: true,
        },
      });
      access = 'admin';
      return;
    }
    res.status(401).send({
      message: 'Invalid username or password',
      statusCode: 401,
    });
  },

  'POST /api/logout': (_req: Request, res: Response) => {
    access = '';
    res.send({ message: 'Logged out' });
  },

  'POST /api/currentUser': (_req: Request, res: Response) => {
    if (!getAccess()) {
      res.status(401).send({
        message: 'Not authenticated',
        statusCode: 401,
      });
      return;
    }
    res.send({
      name: 'admin',
      email: 'admin@example.com',
      note: 'Default administrator account',
      status: 1,
      is_admin: true,
      info: {
        email_verification: false,
        email_alarm_notification: false,
        other: {},
      },
    });
  },

  'GET /api/users': (_req: Request, res: Response) => {
    res.send({
      data: [
        {
          guid: 'mock-guid-1',
          name: 'admin',
          email: 'admin@example.com',
          note: 'Default administrator account',
          status: 1,
          is_admin: true,
        },
      ],
      total: 1,
    });
  },

  'GET /api/peers': (_req: Request, res: Response) => {
    res.send({ data: [], total: 0 });
  },

  'GET /api/device-groups': (_req: Request, res: Response) => {
    res.send({ data: [], total: 0 });
  },

  'GET /api/ab/shared/profiles': (_req: Request, res: Response) => {
    res.send({ data: [], total: 0 });
  },

  'GET /api/audits/conn': (_req: Request, res: Response) => {
    res.send({ data: [], total: 0 });
  },

  'GET /api/audits/file': (_req: Request, res: Response) => {
    res.send({ data: [], total: 0 });
  },

  'GET /api/audits/alarm': (_req: Request, res: Response) => {
    res.send({ data: [], total: 0 });
  },

  'GET /api/audits/console': (_req: Request, res: Response) => {
    res.send({ data: [], total: 0 });
  },
};

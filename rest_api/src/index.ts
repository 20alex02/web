import express from 'express';
import cors from 'cors';
import { config as configEnvVariables } from 'dotenv';
import { env } from 'process';
import type { ApiResponse } from './controllers/types';
import routes from './routes/routes';

configEnvVariables();
const app = express();
const port = env.PORT ?? 3000;

// CORS middlware
app.use(cors());

// JSON middleware
app.use(express.json());

// parse URL encoded strings
app.use(express.urlencoded({ extended: true }));

// DO NOT MODIFY THE PRECEDING code ^^

/*
  Continue here. Write your RESTful API routes here. Use `Router` from express
  to divide the routes into smaller parts. Routes should use the
  `employeeRepository` - you need to first finish it. More is in the
  assignment issue.
*/
app.use('/employee', routes);

// DO NOT MODIFY THE FOLLOWING code:

// No route was taken - 404 - Resource (API endpoint) not found.
app.use((_req, res) => {
  const response: ApiResponse<{}> = {
    status: 'failure',
    data: {},
    error: 'No matching endpoint was found.',
  };

  return res.status(404).send(response);
});

if (env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(
      `[${new Date().toISOString()}] RESTful API for iteration 06 is listening on port ${port}`,
    );
  });
}

export default app;

import type { ResponseToolkit } from '@hapi/hapi';
import { type StatusCode, statusCodes } from './constants';

export interface ApiResponse<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

// eslint-disable-next-line
export type HapiResponseFunction = (res: ResponseToolkit) => ReturnType<ResponseToolkit['response']>;

export const success = <T = unknown>(
  data?: T,
  message = 'Success',
  statusCode: StatusCode = statusCodes.OK,
): HapiResponseFunction => {
  return (res: ResponseToolkit) => {
    const response: ApiResponse<T> = {
      statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    return res.response(response).code(statusCode);
  };
};

export const error = (
  errorData?: string | unknown,
  message = 'Error',
  statusCode: StatusCode = statusCodes.SERVER_ISSUE,
): HapiResponseFunction => {
  return (res: ResponseToolkit) => {
    const response: ApiResponse = {
      statusCode,
      message,
      error: typeof errorData === 'string' ? errorData : 'An error occurred',
      timestamp: new Date().toISOString(),
    };

    return res.response(response).code(statusCode);
  };
};

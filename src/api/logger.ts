import { Request, ResponseToolkit } from "@hapi/hapi";

export function validationError(request: Request, h: ResponseToolkit, error: Record<string, any>): void {
  console.error(error.message);
}

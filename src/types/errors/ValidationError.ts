import { BaseError } from "make-error";
export class ValidationError extends BaseError {
  constructor(message: string) {
    super("Validation Error: " + message);
  }
}

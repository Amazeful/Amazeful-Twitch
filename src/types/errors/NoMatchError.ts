import { BaseError } from "make-error";
export class NoMatchError extends BaseError {
  constructor(operation: string) {
    super(
      `No Match: ${operation} did not find any matches using the provided settings.`
    );
  }
}

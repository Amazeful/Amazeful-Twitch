export class ValidationError extends Error {
  constructor(m: string) {
    super(m);
    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = "ValidationError";
    this.message = `Validation Error: ${m}`;
  }
}

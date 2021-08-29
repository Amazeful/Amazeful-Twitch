//Constructor is a any class constructor function
export type Constructor<T> = {
  new (...args: any[]): T;
};

// VariableResolver if a function that resolves custom variable values
export type VariableResolver = (...args: any[]) => Promise<string>;

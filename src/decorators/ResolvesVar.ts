import { VariableResolverDecorator } from "../types/Misc";

// ResolvesVar decorator registers a method as custom variable resolver
// Value of custom variable will be replaced with the value returned from the method.
// If min number of params is specified and the user does not provide enough params, the command controller will throw without calling the resolver.
// Variables are always resolved recursively with the innermost variable getting resolved first.
export const ResolvesVar =
  (): VariableResolverDecorator => (target, propertyKey, descriptor) => {};

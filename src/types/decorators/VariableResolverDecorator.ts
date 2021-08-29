import { Module } from "../Module";
import { VariableResolver } from "../handlers/VariableResolver";
// VariableResolverDecorator defines a type for custom variable resolver method decorator
// Variable resolver method must be an async function that returns a string
export type VariableResolverDecorator = (
  target: Module,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<VariableResolver>
) => void;

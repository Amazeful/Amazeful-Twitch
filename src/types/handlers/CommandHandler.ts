// CommandHandler is a function that handles calls to a specific default command
export type CommandHandler = (
  sender: string,
  args: string[]
) => Promise<string>;

import { RefreshingAuthProvider } from "@twurple/auth";
import { singleton } from "tsyringe";

@singleton()
export class ApiClient {
  public readonly authProvider: RefreshingAuthProvider;
  private readonly token: AccessToken;


  constructor() {
      this.
  }
}

import { Agenda as AgendaBase } from "agenda";
import { singleton } from "tsyringe";

@singleton()
export class Agenda extends AgendaBase {}

import LinkedList from "@aidenhadisi/doublylinkedlist";
import { PrivmsgMessage } from "@aidenhadisi/dank-twitch-irc";
import { Valid, Validate } from "@aidenhadisi/joi-decorators";
import RE2 from "re2";

import { RegisterMessageHandler } from "../decorators/RegisterMessageHandler";
import { PurgeConfig } from "../models/PurgeConfig";
import { PurgeSchema } from "../validators/PurgeSchema";
import { ValidationError } from "../types/errors/ValidationError";
import { PurgeOptions } from "../types/options/PurgeOptions";
import { PurgeData } from "../types/data/PurgeData";
import { RegisterModule } from "../decorators/RegisterModule";
import { Channel } from "../models/Channel";
import { Module } from "../types/Module";
import { TwitchInfo } from "../types/data/AdditionalTwitchData";
import { NoMatchError } from "../types/errors/NoMatchError";
import { CommonUtils } from "../utils/CommonUtils";
@RegisterModule()
export class Purge extends Module {
  //A linked list is the best structure for purge since it allows insertation and deletion at both ends in constant time (O(1))
  private messages: LinkedList<PurgeData>;
  private config!: PurgeConfig;
  constructor(channelData: Channel) {
    super(channelData);
    this.messages = new LinkedList();
  }

  /**
   * Initializes the purge module.
   */
  public async init(): Promise<void> {
    const config = new PurgeConfig();
    config.channel = this.channelData.channelID;

    this.config = await this.orm.findOneOrCreate(
      PurgeConfig,
      { channel: this.channelData.channelID },
      config
    );
  }

  @RegisterMessageHandler(true)
  public async messageHandler(
    msg: PrivmsgMessage,
    info: TwitchInfo
  ): Promise<void> {
    //If not enabled, don't record anything
    if (!this.config.enabled) return;

    //If user's roles is above min targeted role don't do anything
    if (info.userRole > this.config.maxTarget) {
      return;
    }
    //Add new messages to the end of list
    this.messages.push({
      id: msg.messageID,
      sender: msg.senderUsername,
      message: msg.messageText,
      timeStamp: new Date().valueOf()
    });
  }

  /**
   * Performs a purge operation
   * @param options PurgeOptions
   */
  @Validate()
  public async purge(@Valid(PurgeSchema) options: PurgeOptions): Promise<void> {
    //If not enabled, throw validation error
    if (!this.config.enabled) {
      throw new ValidationError(
        "Module purge is currently disabled. You must enable the purge module before using this command."
      );
    }

    const lookbackTime = new Date().valueOf() - options.lookbackTime;

    let matchedData: Array<PurgeData> = [];

    //If phrase is a regex use regex
    if (options.regex) {
      const predicate: PurgeSearchPredicate = (data: PurgeData) => {
        const flags = options.caseSensitive ? "i" : undefined;
        const regex = new RE2(options.pattern, flags);
        return regex.test(data.message);
      };

      matchedData = this.searchMessages(predicate, lookbackTime);
    }
    //otherwise use indexOf which performs faster
    else {
      const predicate: PurgeSearchPredicate = (data: PurgeData) => {
        return data.message.indexOf(options.pattern) > -1;
      };

      matchedData = this.searchMessages(predicate, lookbackTime);
    }

    if (!matchedData.length) {
      throw new NoMatchError(
        `Provided pattern did not match any messages in given lookback time.`
      );
    }
  }

  /**
   * Searches message list and returns a list of results that match the given predicate
   * @param predicate
   * @param minTimestamp
   * @returns PurgeData[]
   */
  private searchMessages(
    predicate: PurgeSearchPredicate,
    minTimestamp?: number
  ): Array<PurgeData> {
    const results: PurgeData[] = [];

    //search the list from the end, so if we reach the the loockback time limit we can stop right away
    let node = this.messages.tail;
    while (node && node.val) {
      //Stop if we are over time limit
      if (
        CommonUtils.isDefined(minTimestamp) &&
        node.val.timeStamp < minTimestamp
      ) {
        break;
      }

      if (predicate(node.val)) {
        results.push(node.val);
      }

      node = node.prev;
    }
    return results;
  }

  // private performModAction(messages: Array<PurgeData>, options: PurgeOptions) {
  //   if (options.timeoutDuration === "delete") {
  //     for (const message of messages) {
  //       this.chatClient.privmsg(
  //         this.channelData.login,
  //         `.delete ${message.id}`,
  //         true
  //       );
  //     }
  //   }
  // }

  public destroy(): void {
    throw new Error("Method not implemented.");
  }
}

type PurgeSearchPredicate = (data: PurgeData) => boolean;

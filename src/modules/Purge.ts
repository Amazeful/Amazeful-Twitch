import LinkedList from "@aidenhadisi/doublylinkedlist";
import { PrivmsgMessage } from "@aidenhadisi/amazeful-twitch-irc";
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
import { CommonUtils } from "../utils/CommonUtils";
import { PurgeResults } from "../models/PurgeResults";
@RegisterModule()
export class Purge extends Module {
  //A linked list is the best structure for purge since it allows insertation and deletion at both ends in constant time (O(1))
  private messages: LinkedList<PurgeData>;
  private config!: PurgeConfig;
  private continuousPurgeData?: PurgeOptions;
  private continuousPurgeTimeout?: NodeJS.Timeout;

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

    const data: PurgeData = {
      id: msg.messageID,
      sender: msg.senderUsername,
      message: msg.messageText,
      timeStamp: new Date().valueOf()
    };
    //Add new messages to the end of list
    this.messages.push(data);

    this.checkMessage(data);
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

    //Find messages
    const matchedData = this.searchMessages(options);

    this.prepareAndDispatch(matchedData, options);

    this.setContinuousPurge(options);
    const purgeResults = new PurgeResults(options, matchedData);

    const repository = this.orm.em.getRepository(PurgeResults);
    await repository.persistAndFlush(purgeResults);
  }

  /**
   * Removes the last purge data and ends continuous purge
   */
  public clearContinuousPurge(): void {
    if (this.continuousPurgeData) {
      this.continuousPurgeData = undefined;
    }
    if (this.continuousPurgeTimeout) {
      clearTimeout(this.continuousPurgeTimeout);
      this.continuousPurgeTimeout = undefined;
    }
  }

  /**
   * Starts the Continuous Purge
   * @param options purge options
   */
  private setContinuousPurge(options: PurgeOptions): void {
    if (this.config.defaultContinuous || options.continuousTime) {
      this.clearContinuousPurge();
      this.continuousPurgeData = options;
      this.continuousPurgeTimeout = setTimeout(
        () => this.clearContinuousPurge(),
        (options.continuousTime ?? this.config.defaultContinuousTime) * 1000
      );
    }
  }

  /**
   * Checks incoming message against last purge if continuous purge is enabled
   * @param data purge data
   */
  private checkMessage(data: PurgeData) {
    if (this.continuousPurgeData) {
      const predicate = this.continuousPurgeData.regex
        ? this.regexPredicate
        : this.defaultPredicate;

      if (predicate(data.message, this.continuousPurgeData)) {
        this.dispatchModAction(data, this.continuousPurgeData);
      }
    }
  }

  /**
   * Regex Predicate matches messages using a regular expression
   * @param message
   * @param options
   * @returns boolean
   */
  private regexPredicate: PurgeSearchPredicate = (
    message: string,
    options: PurgeOptions
  ) => {
    try {
      const flags = options.caseSensitive ? undefined : "i";
      const regex = new RE2(options.pattern, flags);
      return regex.test(message);
    } catch (e) {
      throw new ValidationError("Invalid regex provided.");
    }
  };

  /**
   * Default predicate matches messages using indexOf method which performs faster than regex
   * @param message
   * @param options
   * @returns boolean
   */
  private defaultPredicate: PurgeSearchPredicate = (
    message: string,
    options: PurgeOptions
  ) => {
    if (options.caseSensitive) {
      return message.indexOf(options.pattern) > -1;
    }
    return message.toLowerCase().indexOf(options.pattern) > -1;
  };

  /**
   * Searches message list and returns a list of results that match the predicate
   * @param options PurgeOptions
   * @param minTimestamp
   * @returns PurgeData[]
   */
  private searchMessages(options: PurgeOptions): Array<PurgeData> {
    const results: PurgeData[] = [];

    const lookbackTime = new Date().valueOf() - options.lookbackTime;

    const predicate = options.regex
      ? this.regexPredicate
      : this.defaultPredicate;

    //search the list from the end, so if we reach the the loockback time limit we can stop right away
    let node = this.messages.tail;
    while (node && node.val) {
      //Stop if we are over time limit
      if (
        CommonUtils.isDefined(lookbackTime) &&
        node.val.timeStamp < lookbackTime
      ) {
        break;
      }

      if (predicate(node.val.message, options)) {
        results.push(node.val);
      }

      node = node.prev;
    }
    return results;
  }

  /**
   * Sends out a mod action based on provided options
   * @param message
   * @param options
   */
  private dispatchModAction(message: PurgeData, options: PurgeOptions): void {
    if (options.timeoutDuration === "delete") {
      this.chatClient.deleteMsg(this.channelData.login, message.id);
    } else if (options.timeoutDuration === "ban") {
      this.chatClient.ban(
        this.channelData.login,
        message.sender,
        `Purged with phrase: ${options.pattern}`
      );
    } else {
      this.chatClient.timeout(
        this.channelData.login,
        message.sender,
        +options.timeoutDuration,
        `Purged with phrase: ${options.pattern}`
      );
    }
  }

  /**
   * Prepares purge data and sends out mod actions
   * @param purgeData
   * @param options
   * @returns void
   */
  private prepareAndDispatch(
    purgeData: Array<PurgeData>,
    options: PurgeOptions
  ): void {
    if (options.timeoutDuration !== "delete") {
      const set = new Set<string>();
      for (const data of purgeData) {
        if (!set.has(data.sender)) {
          this.dispatchModAction(data, options);
          set.add(data.sender);
        }
      }
    } else {
      for (const data of purgeData) {
        this.dispatchModAction(data, options);
      }
    }
  }

  public destroy(): void {
    throw new Error("Method not implemented.");
  }
}

type PurgeSearchPredicate = (message: string, options: PurgeOptions) => boolean;

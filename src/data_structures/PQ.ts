import { Heap } from "./Heap";

//Class PQ is a priority queue structure
export class PQ<T = any> extends Heap<PQData<T>> {
  constructor() {
    //Highest priority first
    super((a, b) => b.priority - a.priority);
  }

  /**
   * Add an item to priority queue
   * @param item An item to add to the queue
   * @param priority priority for the item. Defaults to 0
   */
  public enqueue(item: T, priority = 0) {
    this.push({ data: item, priority: priority });
  }

  /**
   * Remove and return the first item in queue line
   * @returns an item from the queue
   */
  public dequeue(): T | undefined {
    let value = this.remove();
    return value?.data;
  }

  /**
   * Peak into items of queue
   * @returns a copy of elem in top of the queue without popping the element
   */
  public peak(): T {
    return this.items[0].data;
  }

  /**
   * Removes all items in queue
   */
  public clear(): void {
    this.items = [];
  }

  /**
   * Returns the highest priority in the queue
   * @returns highest priority
   */
  public highestPriority() {
    return this.items[0].priority;
  }

  /**
   * Returns the lowest priority in the queue
   * @returns lowest priority
   */
  public lowestPriority() {
    return this.items[this.size - 1].priority;
  }
}

export interface PQData<T> {
  data: T;
  priority: number;
}

export interface IQueuePublisher {
  publish(queue: string, message: any): Promise<void>;
}

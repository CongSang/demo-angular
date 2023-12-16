export interface ISubscriber {
  name: string;
  email: string;
  createdAt: any;
}

export interface ISubscriberResponse {
  id: string;
  data: ISubscriber;
}

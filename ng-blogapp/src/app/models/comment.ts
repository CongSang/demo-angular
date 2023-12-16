export interface IComment {
  name: string;
  comment: string;
  createdAt: any;
}

export interface ICommentResponse {
  id: string;
  data: IComment;
}


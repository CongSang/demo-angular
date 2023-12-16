export interface IPost {
  title: string;
  permalink: string;
  category: {
    categoryId: string;
    categoryName: string;
  }
  postImgUrl: string;
  excerpt: string;
  content: string;
  isFeatured: boolean;
  views: number;
  status: string;
  createdAt: any;
}

export interface IPostResponse {
  id: string;
  data: IPost;
}

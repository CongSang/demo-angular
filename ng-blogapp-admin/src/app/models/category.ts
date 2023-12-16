export interface ICategory {
  category: string;
  description: string;
}

export interface ICategoryResponse {
  id: string;
  data: ICategory;
}

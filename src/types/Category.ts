export interface Category {
  id: string;
  name: string;
  children?: Array<Category>;
}

import { Category } from 'src/category/entities/category.entity';

export class FilterPostDto {
  page: string;
  items_per_page: string;
  search: string;
  category: Category;
}

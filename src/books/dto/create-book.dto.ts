export class CreateBookDto {
  title: string;
  author: string;
  description: string;
  imageUrl?: string;
  category?: string;
  totalCopies: number;
}

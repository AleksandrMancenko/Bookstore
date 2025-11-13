export interface BookBase {
  title: string;
  subtitle?: string;
  isbn13: string;
  price: string;     // в API это строка, оставляем так
  image: string;
  url: string;
}
export interface BookDetails extends BookBase {
  authors?: string;
  publisher?: string;
  language?: string;
  pages?: string;
  year?: string;
  rating?: string;
  desc?: string;
  pdf?: Record<string, string> | null;
}

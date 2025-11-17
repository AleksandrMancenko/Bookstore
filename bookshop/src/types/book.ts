export interface BookBase {
  title: string;
  subtitle?: string;
  isbn13: string;
  price: string;     // API returns this as a string, keeping it as is
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

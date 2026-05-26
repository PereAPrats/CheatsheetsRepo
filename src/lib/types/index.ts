export interface Snippet {
  label: string;
  code: string;
}

export interface Entry {
  title: string;
  snippets: Snippet[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  items: Entry[];
}

export interface CheatsheetData {
  categories: Category[];
}

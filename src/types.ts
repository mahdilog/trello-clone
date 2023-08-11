export interface Card {
  title: string;
  id: string;
  description: string;
}

export interface Item {
  id: string;
  title: string;
  card: Card[];
}

export interface FormValues {
  data: Item[];
}

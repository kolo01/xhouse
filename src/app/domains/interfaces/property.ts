import {Characteristic} from './characteristic';
import {Image} from './image';

export interface Property {
  id: number;
  slug: string;
  label: string;
  price: number | null;
  address: string;
  city: string;
  surface: number | null;
  property_type: string;
  state: string;
  description: string;
  bedrooms_number: number | null;
  bathrooms_number: number | null;
  status: boolean;
  characteristics: Characteristic[];
  images: Image[];
}

import { Document } from '@contentful/rich-text-types';

export type Entry<T> = {
  fields: T;
};

export type BlogPost = {
  title: string;
  published: string;
  body: Document;
};

import axios from 'axios';
import { Entry } from './types';

const spaceId = '1fhzf2g69w98';
const environment = 'master';

const contentfulApi = axios.create({
  baseURL: `https://cdn.contentful.com/spaces/${spaceId}/environments/${environment}`,
  params: {
    access_token: 'bH-cYJNBX2mX2ejXvhnnUKlvi_3F0N12ANUPGRmZllI',
  },
});

export async function getContentfulEntry<T = unknown>(entryId: string) {
  const { data } = await contentfulApi.get<Entry<T>>(
    `/entries/${entryId}`,
  );
  return data;
}

export async function getContentfulEntriesByField<T = unknown>({
  contentType,
  field,
  value,
}: {
  contentType: string;
  field: string;
  value: string;
}) {
  const { data } = await contentfulApi.get<{
    items: Entry<T>[];
  }>(`/entries`, {
    params: {
      content_type: contentType,
      [`fields.${field}`]: value,
    },
  });
  return data;
}

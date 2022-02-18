// import {
//   type AsyncStorageWithOptions,
//   createAsyncStorage,
// } from '@solid-primitives/storage';
// import { get, set, clear, keys, getMany, values, del } from 'idb-keyval';

// type IdbStoreOptions = {
//   // path: string;
//   // domain: string;
//   // expires: DOMTimeStamp;
//   // sameSite: "None" | "Lax" | "Strict"
// };
// const IdbStoreApi: AsyncStorageWithOptions<IdbStoreOptions> = {
//   getItem: async key => {
//     const item = await get(key);
//     return item ?? null;
//   },
//   getAll: () => values(),
//   setItem: (key: string, value: string, options: IdbStoreOptions = {}) =>
//     set(key, value),
//   removeItem: key => del(key),
//   clear,
//   key: async (index: number) => {
//     const allKeys = await keys();
//     return allKeys[index];
//   },
// };

// const createIdbStorage = props =>
//   createAsyncStorage({ ...props, api: IdbStoreApi });

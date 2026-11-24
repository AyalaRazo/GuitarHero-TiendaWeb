import { createStore, isArray, uid, useStore } from './persist';

export interface Address {
  id: string;
  userId: string;
  label: string;
  name: string;
  street: string;
  colony: string;
  zip: string;
  city: string;
  state: string;
  phone: string;
  primary?: boolean;
}

export type AddressInput = Omit<Address, 'id' | 'userId' | 'primary'>;

const isAddressList = (value: unknown): value is Address[] =>
  isArray(value) && value.every((item) => typeof item === 'object' && item !== null && typeof (item as Address).id === 'string');

export const addressesStore = createStore<Address[]>('addresses', () => [], isAddressList);

export function useAddresses(userId: string | undefined): Address[] {
  const all = useStore(addressesStore);
  return all.filter((address) => address.userId === userId);
}

export const primaryOf = (list: Address[]): Address | undefined => list.find((a) => a.primary) ?? list[0];

/* Sin id crea una dirección; con id la edita. La primera que se guarda queda como principal. */
export function saveAddress(userId: string, input: AddressInput, id?: string): boolean {
  return addressesStore.set((all) => {
    if (id) return all.map((a) => (a.id === id && a.userId === userId ? { ...a, ...input } : a));
    const isFirst = !all.some((a) => a.userId === userId);
    return [...all, { id: uid(), userId, primary: isFirst, ...input }];
  });
}

export const setPrimaryAddress = (userId: string, id: string): boolean =>
  addressesStore.set((all) => all.map((a) => (a.userId === userId ? { ...a, primary: a.id === id } : a)));

export function deleteAddress(userId: string, id: string): boolean {
  return addressesStore.set((all) => {
    const remaining = all.filter((a) => !(a.id === id && a.userId === userId));
    const mine = remaining.filter((a) => a.userId === userId);
    // Si se borró la principal, la primera que queda toma su lugar
    if (mine.length > 0 && !mine.some((a) => a.primary)) {
      return remaining.map((a) => (a.id === mine[0].id ? { ...a, primary: true } : a));
    }
    return remaining;
  });
}

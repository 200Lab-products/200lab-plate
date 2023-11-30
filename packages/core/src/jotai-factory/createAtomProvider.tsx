import React, {
  Context,
  createContext,
  FC,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createStore } from 'jotai/vanilla';

import { AtomProvider, AtomProviderProps } from './atomProvider';
import { AtomRecord, JotaiStore } from './createAtomStore';
import { useHydrateStore, useSyncStore } from './useHydrateStore';

// Global store contexts
const storeContexts = new Map<string, Context<JotaiStore>>();

const GLOBAL_STORE_SCOPE = 'global';
const GLOBAL_SCOPE = 'global';

export const getFullyQualifiedScope = (storeScope: string, scope: string) => {
  return `${storeScope}:${scope}`;
};

export const getContext = (
  storeScope = GLOBAL_STORE_SCOPE,
  scope = GLOBAL_SCOPE,
  createIfNotExists = false
) => {
  const fullyQualifiedScope = getFullyQualifiedScope(storeScope, scope);
  if (createIfNotExists && !storeContexts.has(fullyQualifiedScope)) {
    /**
     * In some circumstances, when used without a store, jotai presents
     * multiple different versions of the same atom depending on where the atom
     * is accessed from. (See https://github.com/pmndrs/jotai/discussions/2044)
     *
     * To avoid this case, we return a default store for use in the absence of
     * a provider.
     *
     * This is not covered by any test; when editing this code, please manually
     * verify that table cell selection and column resizing are not broken.
     */
    storeContexts.set(fullyQualifiedScope, createContext(createStore()));
  }
  return storeContexts.get(fullyQualifiedScope);
};

export const useContextStore = (
  storeScope = GLOBAL_STORE_SCOPE,
  scope = GLOBAL_SCOPE
) => {
  const context =
    getContext(storeScope, scope) ??
    getContext(storeScope, GLOBAL_SCOPE, true)!;
  return useContext(context);
};

export type ProviderProps<T extends object> = AtomProviderProps &
  Partial<T> & {
    scope?: string;
    initialValues?: Partial<T>;
    resetKey?: any;
  };

export const HydrateAtoms = <T extends object>({
  initialValues,
  children,
  store,
  atoms,
  ...props
}: Omit<ProviderProps<T>, 'scope'> & {
  atoms: AtomRecord<T>;
}) => {
  useHydrateStore(atoms, { ...initialValues, ...props } as any, {
    store,
  });
  useSyncStore(atoms, props as any, {
    store,
  });

  return <>{children}</>;
};

/**
 * Creates a generic provider for a jotai store.
 * - `initialValues`: Initial values for the store.
 * - `props`: Dynamic values for the store.
 */
export const createAtomProvider = <T extends object, N extends string = ''>(
  storeScope: N,
  atoms: AtomRecord<T>,
  options: { effect?: FC } = {}
) => {
  const Effect = options.effect;

  // eslint-disable-next-line react/display-name
  return ({ store, scope, children, resetKey, ...props }: ProviderProps<T>) => {
    const ScopedContext = getContext(storeScope, scope, true)!;
    const GlobalContext = getContext(storeScope, GLOBAL_SCOPE, true)!;

    const [storeState, setStoreState] = useState<JotaiStore>(createStore());

    useEffect(() => {
      if (resetKey) {
        setStoreState(createStore());
      }
    }, [resetKey]);

    return (
      <ScopedContext.Provider value={storeState}>
        <GlobalContext.Provider value={storeState}>
          <AtomProvider store={storeState}>
            <HydrateAtoms store={storeState} atoms={atoms} {...(props as any)}>
              {!!Effect && <Effect />}

              {children}
            </HydrateAtoms>
          </AtomProvider>
        </GlobalContext.Provider>
      </ScopedContext.Provider>
    );
  };
};

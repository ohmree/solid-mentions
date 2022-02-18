import { ClientCredentialsAuthProvider } from '@twurple/auth';
import { type Component, type Accessor, createContext, useContext, createSignal } from 'solid-js';
import { createStore, DeepReadonly } from 'solid-js/store';

export const TwitchAuthContext = createContext<DeepReadonly<ClientCredentialsAuthProvider>>();

export const TwitchAuthProvider: Component<{ config: ApiConfig }> = props => {
  const [client] = createStore(new ApiClient(props.config));

  return (
    <TwitchAuthContext.Provider value={client}>
      {props.children}
    </TwitchAuthContext.Provider>
  );
};

export const useTwitchAuth = () =>
  useContext(TwitchAuthContext) as [
    {
      count: number;
    },
    {
      increment: () => void;
      decrement: () => void;
    },
  ];

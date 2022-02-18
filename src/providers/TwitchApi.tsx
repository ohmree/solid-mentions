import { ApiClient, ApiConfig } from '@twurple/api';
import { type Component, createContext, useContext } from 'solid-js';
import { createStore, DeepReadonly } from 'solid-js/store';

export const TwitchApiContext = createContext<DeepReadonly<ApiClient>>();

export const TwitchApiProvider: Component<{ config: ApiConfig }> = props => {
  const [client] = createStore(new ApiClient(props.config));

  return (
    <TwitchApiContext.Provider value={client}>
      {props.children}
    </TwitchApiContext.Provider>
  );
};

export const useTwitchApi = () => useContext(TwitchApiContext);

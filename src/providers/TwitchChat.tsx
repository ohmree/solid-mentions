import { ChatClient, type ChatClientOptions } from '@twurple/chat';
import type { Component } from 'solid-js';
import type { Store } from 'solid-js/store';

interface ChatState {
  client: ChatClient;
  isConnected: boolean;
}

type ChatStoreData = [
  Store<ChatState>,
  {
    isConnected(): boolean;
  },
];

export const TwitchChatContext = $createContext<ChatStoreData>();

export const TwitchChatProvider: Component<{
  options?: ChatClientOptions;
}> = ({ options, children }) => {
  const [state, setState] = $store<ChatState>({
    client: new ChatClient(options),
    isConnected: false,
  });

  state.client.onConnect(() => setState('isConnected', true));
  state.client.onDisconnect(() => setState('isConnected', false));

  const store: ChatStoreData = [
    state,
    {
      isConnected() {
        return state.isConnected;
      },
    },
  ];

  return (
    <TwitchChatContext.Provider value={store}>
      {children}
    </TwitchChatContext.Provider>
  );
};

export const useTwitchChat = () => $useContext(TwitchChatContext);

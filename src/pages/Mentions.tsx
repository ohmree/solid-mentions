import { createLocalStorage } from '@solid-primitives/storage';
import { Col, Container, Form, Row } from 'solid-bootstrap';
import { Component, createMemo } from 'solid-js';
import { useTwitchChat } from '../providers/TwitchChat';
import type Mention from '../types/Mention';
import { createEventListener } from '@solid-primitives/event-listener';
import TagInput from '../components/TagInput';
import { useAuth } from '~/services/auth';
import { Navigate } from 'solid-app-router';

const Mentions: Component = () => {
  const authService = useAuth();
  const [chat, { isConnected }] = useTwitchChat()!;
  const [store, setStore, { remove: removeFromStore }] = createLocalStorage<
    unknown,
    any
  >({
    prefix: 'ttv-mentions',
    serializer: obj => JSON.stringify(obj),
    /* HACK: this is a mess, we should really be using IndexedDB here. */
    deserializer: str => {
      const obj = JSON.parse(str);
      if (typeof obj[0] === 'object' && obj[0].time) {
        return obj.map((mention: any) => ({
          ...mention,
          time: new Date(mention.time),
        }));
      } else {
        return obj;
      }
    },
  });
  let joinedWords: () => string;
  const [state, setState] = $store({
    mentions: (store.mentions ?? []) as Mention[],
    words: (store.words ?? []) as string[],
    caseSensitive: false,
    get joinedWords() {
      return joinedWords();
    },
  });
  joinedWords = createMemo(() => state.words.join(' '));

  const clearMentions = () => {
    setState('mentions', []);
    removeFromStore('ttv-mentions.mentions');
  };

  const maybeLowercase = (str: string) =>
    state.caseSensitive ? str.toLowerCase() : str;

  chat.client.onMessage((channel, user, message, messageObject) => {
    const messageWords = maybeLowercase(message)
      .replace(/\s*[^\w\s]\s*/g, '')
      .split(' ');
    for (const word of state.words.map(maybeLowercase)) {
      if (messageWords.includes(word)) {
        const color = messageObject.userInfo.color;
        const timestampString = messageObject.tags.get('tmi-sent-ts');
        /* NOTE: Here we use `||` instead of `??` because we don't want `NaN` to be considered truthy. */
        const timestamp = timestampString
          ? Number.parseInt(timestampString, 10) || undefined
          : undefined;
        const time = timestamp ? new Date(timestamp) : new Date();

        setState(
          $produce(s =>
            s.mentions.push({
              channel,
              message,
              time,
              user,
              color,
            }),
          ),
        );

        return;
      }
    }
  });

  const track = $reaction(async () => {
    if (!isConnected()) {
      await chat.client.connect();
    }
  });
  track(isConnected);

  const displayName = 'ohmree';
  createEventListener(document, 'visibilitychange', () => {
    if (document.visibilityState === 'hidden' && state.mentions.length > 0) {
      setStore('mentions', state.mentions);
    }
  });

  return (
    <$show when={authService().isLoggedIn} fallback={<Navigate href="/login" />}>
      <Container className="my-5">
        <Row>
          <Col xs="12" lg="3">
            <h1>Mentions</h1>
            <p>Logged in as {displayName}!</p>
            <h1>Tracked Words</h1>
            <p>Space seperated.</p>
            <Form
              onSubmit={e => {
                e.preventDefault();
                if (state.words.length > 0) {
                  setStore('words', state.words);
                }
              }}
            >
              <Form.Switch
                id="caseSensitiveCheckbox"
                inline
                label="Case sensitive?"
                onChange={() => setState('caseSensitive', !state.caseSensitive)}
              />
              <TagInput
                placeholder="Example: Ravenbtw"
                setter={words => setState('words', words)}
              />
              <Form.Label htmlFor="additionalHighlights" visuallyHidden>
                Additional highlights
              </Form.Label>
              <Form.Control className="mb-2" type="submit" value="Save Words" />
            </Form>
            <h1>Utilities</h1>
            <Form
              onSubmit={e => {
                e.preventDefault();
                clearMentions();
              }}
            >
              <Form.Control
                type="submit"
                value="Clear Mentions"
                className="mb-2"
              />
            </Form>
            <a
              href="https://www.raven.fo"
              className="text-decoration-none text-light"
            >
              Made by Ravenbtw
            </a>
          </Col>
          <Col xs="12" lg="9">
            <h1>Recent Mentions</h1>
            <$show
              when={state.mentions.length > 0}
              fallback={<p>No mentions yet. {':('}</p>}
            >
              <Row>
                <$for each={state.mentions}>
                  {(message: Mention) => (
                    <Col xs="12">
                      <h4 className="bg-secondary rounded p-3">
                        [
                        <a
                          href={`https://www.twitch.tv/${message.channel}`}
                          className="text-decoration-none text-light"
                        >
                          {message.channel}
                        </a>
                        ]{' '}
                        <a
                          href={`https://www.twitch.tv/${message.user}`}
                          className="text-decoration-none"
                          style={{ color: message.color }}
                        >
                          {message.user}
                        </a>
                        : {message.message}
                      </h4>
                      <p>{message.time.toLocaleString()}</p>
                    </Col>
                  )}
                </$for>
              </Row>
            </$show>
          </Col>
        </Row>
      </Container>
    </$show>
  );
};

export default Mentions;

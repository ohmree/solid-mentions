import { Form } from 'solid-bootstrap';
import { JSX } from 'solid-js';
import 'tagin/src/tagin.scss';

interface Options {
  separator?: string;
  placeholder?: string;
  duplicate?: boolean;
  transform?: (input: string) => string;
  enter?: boolean;
  setter?: (tags: readonly string[]) => void;
}

/* const classElement = 'tagin'; */
const classWrapper = 'tagin-wrapper';
const classTag = 'tagin-tag';
const classRemove = 'tagin-tag-remove';
const classInput = 'tagin-input';
const classInputHidden = 'tagin-input-hidden';

const TagInput: Component<Options> = ({
  separator = ' ',
  placeholder,
  duplicate = false,
  transform = (input: string) => input,
  enter = false,
  setter,
}) => {
  const [state, setState] = $store({
    wrapperFocus: false,
    inputStyles: {} as JSX.CSSProperties,
    tagValues: [] as string[],
    inputValue: '',
    /* get inputValues(): string[] {
     *   return this.inputValue.length > 0 ? this.inputValue.split(separator) : [];
     * }, */
  });

  const getAutowidth = () => {
    const fakeEl = document.createElement('div');
    fakeEl.classList.add(classInput, classInputHidden);
    const string =
      state.inputValue.length > 0 || state.tagValues.length > 0
        ? state.inputValue
        : placeholder ?? '';
    fakeEl.innerHTML = string.replace(/ /g, '&nbsp;');
    document.body.appendChild(fakeEl);
    const width =
      Math.ceil(
        parseInt(window.getComputedStyle(fakeEl).width.replace('px', '')),
      ) + 1;
    fakeEl.remove();
    return `${width}px`;
  };

  let inputElement: HTMLInputElement;

  $(setter?.(state.tagValues));

  return (
    <Form.Control
      as="div"
      className={classWrapper}
      classList={{ focus: state.wrapperFocus }}
      onClick={() => inputElement.focus()}
    >
      <$for each={state.tagValues}>
        {(value, index) => (
          <span class={classTag} style={{ transform: 'scale(1.09)' }}>
            {value}
            <span
              onClick={() =>
                setState($produce(s => s.tagValues.splice(index(), 1)))
              }
              class={classRemove}
            ></span>
          </span>
        )}
      </$for>
      <input
        type="text"
        ref={inputElement!}
        value={state.inputValue}
        className={classInput}
        classList={{ focus: false }}
        placeholder={placeholder}
        style={{
          width: getAutowidth(),
        }}
        onInput={event => {
          const value = (event.target as HTMLInputElement).value.trim();
          setState('inputValue', value);
        }}
        onKeyDown={event => {
          if (state.inputValue.length > 0) {
            if (event.key === separator || (enter && event.key === 'Enter')) {
              const duplicateIndex = state.tagValues.indexOf(state.inputValue);
              if (!duplicate && duplicateIndex !== -1) {
                setState('inputValue', '');
                console.log(`duplicate: ${state.tagValues[duplicateIndex]}`);
              } else {
                setState(
                  $produce(s => {
                    s.tagValues.push(transform(s.inputValue));
                    s.inputValue = '';
                  }),
                );
              }
            }
          } else {
            if (event.key === 'Backspace' && state.tagValues.length > 0) {
              setState($produce(s => s.tagValues.pop()));
            }
          }
        }}
        onFocus={() => {
          setState(
            $produce(s => {
              if (s.inputValue) {
                s.tagValues.push(transform(s.inputValue));
              }
              s.wrapperFocus = true;
              s.inputValue = '';
            }),
          );
        }}
        onBlur={() => {
          setState(
            $produce(s => {
              if (s.inputValue) {
                s.tagValues.push(transform(s.inputValue));
              }
              s.wrapperFocus = false;
              s.inputValue = '';
            }),
          );
        }}
      />
    </Form.Control>
  );
};

export default TagInput;

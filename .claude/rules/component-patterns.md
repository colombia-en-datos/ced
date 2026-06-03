---
paths:
  - "components/**/*.tsx"
  - "features/**/*.tsx"
  - "features/**/*.ts"
  - "hooks/**/*.ts"
---

# Component patterns (Inversion of Control)

Apply these patterns to avoid prop explosion and keep components flexible. Reach for them in this order — use the simplest pattern that solves the problem. Don't invert prematurely for single-use components.

## Compound components

**When:** A component has props like `renderX`, `showY`, `headerContent`, `items={[...]}` that control layout or structure. Three or more diverging use cases sharing one component is the signal.

**How:** Parent owns state via `useState` and exposes it through React Context. Children consume context via a custom hook. The consumer controls structure, ordering, and conditional rendering.

```tsx
const ToggleContext = React.createContext()

function useToggleContext() {
  const ctx = React.useContext(ToggleContext)
  if (!ctx) throw new Error('Must render inside <Toggle>')
  return ctx
}

function Toggle({ children }) {
  const [on, setOn] = useState(false)
  const toggle = useCallback(() => setOn(prev => !prev), [])
  const value = useMemo(() => ({ on, toggle }), [on])
  return <ToggleContext.Provider value={value}>{children}</ToggleContext.Provider>
}

function ToggleButton(props) {
  const { on, toggle } = useToggleContext()
  return <button onClick={toggle} {...props}>{on ? 'ON' : 'OFF'}</button>
}
```

Key rules:
- Always guard context with a custom hook that throws if used outside the provider.
- Memoize the context value to prevent unnecessary re-renders.
- Export sub-components as named exports (not `Toggle.Button`).

## State reducers

**When:** Consumer needs to prevent or modify a specific internal state transition (e.g. "stop toggling after 4 clicks", "keep menu open after selection") but the component should still own its state.

**How:** The hook accepts an optional `reducer` that wraps `useReducer`. Export your default reducer and action types so consumers can call the default and selectively override.

```tsx
const actionTypes = { toggle: 'TOGGLE', on: 'ON', off: 'OFF' }

function toggleReducer(state, action) {
  switch (action.type) {
    case actionTypes.toggle: return { on: !state.on }
    case actionTypes.on:     return { on: true }
    case actionTypes.off:    return { on: false }
    default: throw new Error(`Unhandled type: ${action.type}`)
  }
}

function useToggle({ reducer = toggleReducer } = {}) {
  const [{ on }, dispatch] = useReducer(reducer, { on: false })
  const toggle = () => dispatch({ type: actionTypes.toggle })
  return { on, toggle }
}
```

Consumer overrides one transition:
```tsx
const { on, toggle } = useToggle({
  reducer(state, action) {
    const changes = toggleReducer(state, action)
    if (tooManyClicks && action.type === actionTypes.toggle) {
      return { ...changes, on: state.on } // block toggle
    }
    return changes
  },
})
```

Key rules:
- Action types are public API — changing them is a breaking change.
- Always provide a default reducer so simple consumers pass nothing.
- If you need to **set** state from outside (not just intercept), use control props instead.

## Control props

**When:** Consumer needs to fully own the state externally — typically to synchronize state between two unrelated components (e.g. an input and a toggle reflecting the same value).

**How:** Same pattern as native `<input value={v} onChange={fn} />`. The component accepts `value` + `onChange` and becomes controlled. Internally, check if the prop is provided to decide whether to use internal or external state.

Key rules:
- Follow the `value`/`onChange` naming convention from native HTML.
- Support both controlled and uncontrolled modes (check if prop is `undefined`).
- More powerful than state reducers, but pushes all state management to the consumer.

## Prop getters

**When:** Building a headless hook where the consumer renders their own elements but those elements need specific props (event handlers, aria attributes) to work. Spreading a plain object risks the consumer's handlers clobbering yours.

**How:** Return a function that accepts the consumer's props, merges them safely using `callAll`, and returns the combined result.

```tsx
const callAll = (...fns) => (...args) =>
  fns.forEach(fn => fn?.(...args))

function useToggle() {
  const [on, setOn] = useState(false)
  const toggle = () => setOn(prev => !prev)

  function getTogglerProps(props = {}) {
    return {
      'aria-expanded': on,
      ...props,
      onClick: callAll(props.onClick, toggle), // both handlers run
    }
  }

  return { on, toggle, getTogglerProps }
}
```

Key rules:
- Never spread `onClick` directly — always merge event handlers with `callAll`.
- Include accessibility attributes (`aria-expanded`, `aria-controls`) in the getter.
- This is for headless hooks only. If you control the rendered elements, use compound components instead.

## Pattern selection guide

| You notice... | Pattern |
|---|---|
| Config objects / `renderX` / `items={[...]}` props | Compound components |
| Need to block or tweak one state transition | State reducer |
| Need to sync state across unrelated components | Control props |
| Building a headless hook, consumer renders elements | Prop getters |

These compose — a well-designed component can use compound components for structure, state reducers for behavior, and prop getters for headless rendering. Layer convenience wrappers on top of inverted APIs for simple use cases.

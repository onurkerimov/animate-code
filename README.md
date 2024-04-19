# animate-code
The **AnimateCode** component is a React component designed to animate code blocks. It uses **Prismjs** for code highlighting and **@formkit/auto-animate** for transitions.

See it in heavy action in **xoid**'s docs: [xoid.dev](https://xoid.dev) 

### Usage
```js
import CodeAnimate from 'animate-code';
import 'prismjs/components/prism-jsx' // Make sure to include Prismjs grammar you want to use.
import 'prismjs/themes/prism-tomorrow.css' // Use a Prismjs theme

<AnimateCode
  value={`// Your code here`} // The only required prop
  animationEnabled={true}
  animationOptions={{ duration: 300, easing: 'ease-in-out' }}
  grammar={Prism.languages.jsx}
  language="javascript"
  getKey={customKeyFunction}
  checkSpecialLine={checkSpecialLineFunction}
  renderSpecialLine={renderSpecialLineFunction}
  maxAnchor={20}
  innerProps={{}}

/>
```

### Props

- `value`: (required) The code string to be displayed and animated.
- `animationEnabled`: (optional) A boolean indicating whether animation is enabled. Defaults to `true`.
- `animationOptions`: (optional) An object containing animation options compatible with **@formkit/auto-animate/react**.
- `grammar`: (optional) The Prism grammar object to be used for syntax highlighting. Defaults to `Prism.languages.jsx`.
- `language`: (optional) The language string used for Prism highlighting. Defaults to `"javascript"`.
- `getKey`: (optional) A function used to generate unique keys for lines of code. Defaults to: `(line) => line.trimStart()`. Trimming the beginning makes morphing into different indentations of the same line possible.
- `checkSpecialLine`: (optional) A function used to determine if a line of code is special and should be rendered differently.
- `renderSpecialLine`: (optional) A function used to render special lines of code differently.
- `maxAnchor`: (optional) The maximum number of characters to pad each line by. Defaults to `20`. (You probably won't need this as long as you're animating an indentation level of 20 spaces)
- `innerProps`: (optional) `ComponentProps<'code'>`
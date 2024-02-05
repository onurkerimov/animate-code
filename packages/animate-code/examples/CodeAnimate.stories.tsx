import type { Meta, StoryObj } from '@storybook/react'
import React, { ComponentProps, useState } from 'react'
import CodeAnimate from '../src'
import 'prismjs/components/prism-jsx'
import 'prismjs/themes/prism-tomorrow.css'
import './styles.css'

const Template = (
  args: ComponentProps<typeof CodeAnimate> & {
    before: string
    after: string
  },
) => {
  const [state, setState] = useState(true)
  return (
    <>
      <button onClick={() => setState((s) => !s)}>toggle</button>
      <CodeAnimate
        value={state ? args.before : args.after}
        getKey={(line: string) =>
          line
            .trimStart()
            .replace(/^(export )?const /, '')
            .substring(0, 7)
        }
        {...args}
      />
    </>
  )
}

const meta: Meta<typeof Template> = {
  title: 'Basic animation',
  component: Template,
}

export default meta
type Story = StoryObj<typeof Template>

export const Simple: Story = {
  args: {
    before: `import create from 'xoid'
import { useAtom } from '@xoid/react'
    
export const $counter = create(0)
    
export const Counter = () => {
  const count = useAtom($counter)
  const increment = () => $counter.value++
  const decrement = () => $counter.value--
  return (
    <>
      {count}
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  )
}`,
    after: `import create from 'xoid'
import { useAtom } from '@xoid/react'
 
export const $counter = create(0, (atom) => ({
  increment: () => atom.value++,
  decrement: () => atom.value--,
}))
 
export const Counter = () => {
  const count = useAtom($counter)
  const { increment, decrement } = $counter.actions
 
  return (
    <>
      {count}
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  )
}`,
    animationOptions: {},
  },
}

export const SpecialLines: Story = {
  args: {
    after: `<script setup>
  import create from 'xoid'
  import { useAtom } from '@xoid/vue'

  const $counter = create(0)
  const count = useAtom($counter)
  const increment = () => $counter.value++
  const decrement = () => $counter.value--
</script>
 
<template>
  {{ count }}
  <button @click="increment">+</button>
  <button @click="decrement">-</button>
</template>`,
    before: `import create from 'xoid'
 
export const $counter = create(0)

---

<script setup>
  import { useAtom } from '@xoid/vue'
  import { $counter } from './models.js'
 
  const count = useAtom($counter)
  const increment = () => $counter.value++
  const decrement = () => $counter.value--
</script>
 
<template>
  {{ count }}
  <button @click="increment">+</button>
  <button @click="decrement">-</button>
</template>`,
    checkSpecialLine: (line: string) => ['---'].includes(line),
    renderSpecialLine: () => <hr />,
  },
}

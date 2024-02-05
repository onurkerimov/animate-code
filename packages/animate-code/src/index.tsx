import { useAutoAnimate } from '@formkit/auto-animate/react'
import Prism from 'prismjs'
import React, { ComponentProps, useEffect, useMemo } from 'react'

type LineData = {
  line: string
  key: string
  anchor: number
}

const getKeyDefault = (line: string) => line.trimStart()

export const getHighlightedLines = (props: {
  value: string
  grammar: Parameters<(typeof Prism)['highlight']>[1]
  language: Parameters<(typeof Prism)['highlight']>[2]
}) => {
  const { value, grammar, language } = props
  const highlightedLines = Prism.highlight(value, grammar, language)
    .split('\n')
    .map((s) => (!s ? '\n' : s))

  return highlightedLines
}

export const getLinesData = (props: { value: string; getKey: typeof getKeyDefault }) => {
  const { value, getKey } = props
  const lines = value.split('\n')

  const linesData = [] as LineData[]
  const usedKeys = Object.create(null)
  const ensureUnique = (key: string) => (usedKeys[key] ? key + ++usedKeys[key] : key)

  // It's important that we hold 2 different counters for auto-keyed ones and keyful ones.
  // `usedKeys` is a counter too.
  let j = 0
  // let maxAnchor = 0
  lines.forEach((line) => {
    const initialKey = getKey(line)
    const key = initialKey ? ensureUnique(initialKey) : `${++j}`
    usedKeys[key] = 1
    const anchor = line.indexOf(initialKey)
    // if (anchor > maxAnchor) maxAnchor = anchor
    linesData.push({
      line,
      key: key,
      anchor,
    })
  })
  return linesData
}

export default function CodeAnimate(props: {
  value: string
  animationEnabled?: boolean
  animationOptions?: Parameters<typeof useAutoAnimate>[0]
  grammar?: Parameters<(typeof Prism)['highlight']>[1]
  language?: Parameters<(typeof Prism)['highlight']>[2]
  getKey?: typeof getKeyDefault
  checkSpecialLine?: (line: string) => boolean
  renderSpecialLine?: (props: { line: string }) => JSX.Element
  maxAnchor?: number
  innerProps?: ComponentProps<'code'>
}) {
  const {
    value,
    grammar = Prism.languages.jsx,
    language = 'javascript',
    animationOptions,
    animationEnabled,
    getKey = getKeyDefault,
    checkSpecialLine,
    renderSpecialLine,
    maxAnchor = 15,
    innerProps,
  } = props

  const linesData = useMemo(() => getLinesData({ value, getKey }), [value, getKey])
  const highlightedLines = useMemo(() => getHighlightedLines({ value, grammar, language }), [value])

  const [ref, setEnabled] = useAutoAnimate({
    disrespectUserMotionPreference: true,
    ...animationOptions,
  })

  useEffect(() => setEnabled(animationEnabled), [animationEnabled])

  return (
    <code ref={ref} {...innerProps}>
      {linesData.map((data, i) =>
        checkSpecialLine?.(data.line) ? (
          renderSpecialLine({ line: data.line })
        ) : (
          <Line key={data.key} data={data} maxAnchor={maxAnchor} line={highlightedLines[i]} />
        ),
      )}
    </code>
  )
}

const Line = (props: { data: LineData; maxAnchor: number; line: string }) => {
  const { data, maxAnchor, line } = props
  const padding = maxAnchor - data.anchor

  return (
    <pre
      dangerouslySetInnerHTML={{ __html: line }}
      style={{
        marginLeft: -padding + 'ch',
        paddingLeft: padding + 'ch',
      }}
    />
  )
}

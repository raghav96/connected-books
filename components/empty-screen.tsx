import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Welcome to Connected Books!
        </h1>
        <p className="leading-normal text-muted-foreground">
          Inspired by
          <ExternalLink href="https://www.connectedpapers.com/">Connected Papers</ExternalLink>, we{' '}
          generate similarity graphs for books to help you discover new books!
          .
        </p>
        {/* <p className="leading-normal text-muted-foreground">
          It uses{' '}
          <ExternalLink href="https://vercel.com/blog/ai-sdk-3-generative-ui">
            React Server Components
          </ExternalLink>{' '}
          to combine text with generative UI as output of the LLM. The UI state
          is synced through the SDK so the model is aware of your interactions
          as they happen.
        </p> */}
      </div>
    </div>
  )
}

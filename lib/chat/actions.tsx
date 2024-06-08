import 'server-only';
import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc';
import axios from 'axios';
import { z } from 'zod';
import { nanoid } from '@/lib/utils';
import { saveChat } from '@/app/actions';
import { SpinnerMessage, UserMessage, BotMessage } from '@/components/stocks/message';
import { Chat, Message } from '@/lib/types';
import { auth } from '@/auth';
import { BotCard } from '@/components/stocks';
import { Events } from '@/components/stocks/events';
import { openai } from '@ai-sdk/openai';

async function submitUserMessage(content: string) {
  'use server';

  const aiState = getMutableAIState<typeof AI>();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  });

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>;
  let textNode: undefined | React.ReactNode;

  const result = await streamUI({
    model: openai('gpt-3.5-turbo'),  // Using OpenAI GPT-3.5-turbo model here
    initial: <SpinnerMessage />,
    system: `\
    You are a book search assistant. You can help users find books and generate similarity graphs by clicking on a book from the results of their search.
    If the user requests a book search, call \`search_books\` to show the top 10 books.
    Besides that, you can also provide information based on the book metadata that you have returned to users.`,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('');
        textNode = <BotMessage content={textStream.value} />;
      }

      if (done) {
        textStream.done();
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        });
      } else {
        textStream.update(delta);
      }

      return textNode;
    },
    tools: {
      searchBooks: {
        description: 'Search for books based on a query.',
        parameters: z.object({
          query: z.string().describe('The search query.')
        }),
        generate: async function* ({ query }) {
          yield (
            <BotCard>
              <SpinnerMessage />
            </BotCard>
          );

          const response = await axios.post('/api/search', { question: query });

          const books = response.data.top_books;

          const toolCallId = nanoid();

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'searchBooks',
                    toolCallId,
                    args: { query }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'searchBooks',
                    toolCallId,
                    result: books
                  }
                ]
              }
            ]
          });

          return (
            <BotCard>
              <Events
                props={books.map((book: any) => ({
                  author: book.metadata.author,
                  title: book.metadata.title,
                  metadata: JSON.stringify(book.metadata)
                }))}
              />
            </BotCard>
          );
        }
      }
    }
  });

  return {
    id: nanoid(),
    display: result.value
  };
}

export type AIState = {
  chatId: string;
  messages: Message[];
};

export type UIState = {
  id: string;
  display: React.ReactNode;
}[];

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server';

    const session = await auth();

    if (session && session.user) {
      const aiState = getAIState();

      if (aiState && validateChat(aiState)) {
        const uiState = getUIStateFromAIState(aiState);
        return uiState;
      }
    } else {
      return;
    }
  },
  onSetAIState: async ({ state }) => {
    'use server';

    const session = await auth();

    if (session && session.user) {
      const { chatId, messages } = state;

      const createdAt = new Date();
      const userId = session.user.id as string;
      const path = `/chat/${chatId}`;

      const firstMessageContent = messages[0].content as string;
      const title = firstMessageContent.substring(0, 100);

      const chat: Chat = {
        id: chatId,
        title,
        userId,
        createdAt,
        messages,
        path
      };

      await saveChat(chat);
    } else {
      return;
    }
  }
});

const validateChat = (aiState: any): aiState is Chat => {
  return (
    typeof aiState.id === 'string' &&
    typeof aiState.title === 'string' &&
    typeof aiState.createdAt === 'string' &&
    typeof aiState.userId === 'string' &&
    Array.isArray(aiState.messages)
  );
};

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'tool' ? (
          message.content.map(tool => {
            return tool.toolName === 'searchBooks' ? (
              <BotCard>
                <Events
                  props={tool.result.map((book: any) => ({
                    author: book.metadata.author,
                    title: book.metadata.title,
                    metadata: JSON.stringify(book.metadata)
                  }))}
                />
              </BotCard>
            ) : null;
          })
        ) : message.role === 'user' ? (
          <UserMessage>{message.content as string}</UserMessage>
        ) : message.role === 'assistant' &&
          typeof message.content === 'string' ? (
          <BotMessage content={message.content} />
        ) : null,
    }));
};

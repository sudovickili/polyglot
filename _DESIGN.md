# Polyglot

A language learning App

## Core Flow

### Read stores in a foreign language

Can click on any word to get a hint as to what it means (only for some languages. E.g. mandarin hints are pinyin). They can click again to get a definition.

### AI-Generated stories

The stories are AI-generated to match the user's level.

### Progression Tracking

The app tracks which words users need help on, and which words they don't. The app will bias the LLM output logits to prefer a mixture of words the user knows, words the user needs to work on, and words the user hasn't seen (in the app at least)

The app will also bias the LLM logits to prefer the most frequently-used words for beginner users.

The user will be able to see how many words they know, which words they've looked up, and an overall aptitude score based on that.

### Confirm Understanding

In hard mode, the app will force the user to summarize each story in 1-2 sentences. An AI will judge their summarization to determine if they pass. If not, they will see a reason they didn't pass, and will need to re-read to try again before continuing.
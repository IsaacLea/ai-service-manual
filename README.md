# AI Powered Service Manual for Triumph Tiger 900

This project is an AI-powered motorcycle service manual application.

It uses a Retrieval-Augmented Generation (RAG) approach to perform similarity searches against a vector database, building relevant context before calling an AI model with the user query.

This allows users to interact with the preloaded PDF manual of their choosing using AI.

---

## Technologies Used
- **Next.js**
- **Pinecone** (vector database used for storing service manual content embeddings)
- **OpenAI**
- **Neon** (Postgres cloud database used for logging)

---

## Implementation Notes
- **PDF File parsing:**
  - Server side parsing libraries running in Node were frought with issues trying to get working for various PDFs   and scenarios, so I have stuck with react-pdf library which runs client side for extracting text
- **Error Handling:**
  - Server-side errors are logged to a Neon Postgres cloud database.
  - A simple error handling strategy is used on the APIs by wrapping logic in `try/catch` blocks.
  - For more complex applications, consider wrapping API methods with a function that handles error handling so it doesn't need to be added to each method.
- **Logging:**
  - For a more advanced logging solution, consider using a logger like [pino](https://getpino.io/).

---

## Local Development

- .env.local file needs to be setup with appropriate config values

npm run build
npm run dev





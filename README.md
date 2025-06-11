An AI powered service manual for a Triumph Tiger 900

It uses a RAG approach to do a similarity search against a vector database to build relevant context before calling an AI model with the user query

## Technologies
NextJS
Pinecone vector database
OpenAI

## Implementation notes
Error handling - Server side errors are logged to a Neon postgres cloud database.  A simple error handling stretegy is used on the APIs to do this by using a try/catch.  For more complex applications, consider wrapping API methods with a function that handles error handling so it doesn't need to be added to each method.




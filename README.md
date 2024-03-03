# BACKEND
In the backend, we have a agent jupyter notebook which contains the logic for our Retrieval Augmented Generation Agent. This notebook will later be fecthed as a python file when we create endpoints with the server. <br>
### In order to use the agent simply follow these steps:</span>
1. Run the agent.ipynb notebook.
2. Call the establish_retriever function with a string path to a locally stored PDF file on your device. This file will become the knowledge base of the model. 
3. Call the infer function with your query string as an argument.
4. Chat with the RAG agent like you would with any ohter agent (for example ChatGPT).

### In order to process a user query, our agent follows these steps: </span>
1. First the retriever setup breaks the PDF file into chunks, which are stored as OpenAI Word Embeddings. We store these embeddings in the FAISS Vector Database and return its retriever module.
2. User passes a query to the agent.
3. The agent routes this query across its 3 tools:
   a. Query first hits the retrieval agent which tries to fetch any query relevant information from the chunks of the document stored in the vector database.
   b. If it was a math related query, the numbers are ideally passed to the math tool for arithmetic or can also be directly handled by the retrieval agent itself.
   c. If it was a non math related query, and the retrieval found a strong match from vector database, a retrieval augmented response is sent to the user.
   d. In case no match is found, the agent EXPLICITLY tells the user that it does not know the answer and gives user the answer to route the question to the web.
   e. If the user replies "Yes route to web" or something along these lines, the Search tool is invoked and user routes the query to google search engine and then the response is finally shared with the user. 

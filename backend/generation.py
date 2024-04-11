# !pip install -r data/requirements.txt

from vectorstore import establish_retriever
from langchain_community.utilities import GoogleSearchAPIWrapper
from langchain.agents import load_tools
from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain import hub
from langchain.schema import AgentAction, AgentFinish, OutputParserException
from langchain.agents import AgentType, initialize_agent, Tool, AgentExecutor, AgentOutputParser
from langchain.memory import ConversationBufferWindowMemory
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun, CallbackManagerForToolRun)
from langchain.chains import LLMMathChain, LLMChain
from langchain.prompts import PromptTemplate
from typing import Optional, Type, List, Union
from pydantic import BaseModel, Field
from langchain.tools import BaseTool
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor
from langchain_openai import OpenAI
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage
from langchain.agents.openai_functions_agent.base import create_openai_functions_agent
from langchain.agents.openai_functions_agent.base import OpenAIFunctionsAgent
from langchain.memory import ConversationBufferMemory
from langchain.agents import tool
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.document_loaders import PyPDFLoader
import os
import hashlib
import warnings
import sys

warnings.filterwarnings('ignore')

# used to load the pdfs

# used to create the retrieval tool

# used to create the memory

# used to create the prompt template

# used to create the agent executor


# Setting up the various API Keys that we need
openai_api_key = open("API_key.txt").read().strip()
os.environ["OPENAI_API_KEY"] = openai_api_key
os.environ["SERPAPI_API_KEY"] = '4bde37c74068633153b825cb3ff392ee3a6697a630674d5abb5d55be50f58a49'
os.environ["GOOGLE_API_KEY"] = "AIzaSyDjYdIvnFq1Uw2DW7C5sj8fbXCl9HfF89c"
os.environ["GOOGLE_CSE_ID"] = "74e790ea0cfaf4154"
memory_key = "history"


# Setting up our LLM to be used as the backbone of the RAG
llm = ChatOpenAI(temperature=0, openai_api_key=openai_api_key,
                 model="gpt-3.5-turbo")

# ================ USE ESTABLISH RETRIEVER TO BUILD THE RETRIEVER OBJECT PASSED TO THE retriever_tool function below ====================
paths = [sys.argv[1]]  # Just one file atm.
retriever = establish_retriever(paths)


# This is the retrieval tool that searches the documents and fetches chunks most similar to user query using FAISS. DO NOT CHANGE THIS FUNCTION DEFINITION SINCE THIS IS EXPECTED BY LANGCHAIN API.
@tool
def retriever_tool(query):
    "Searches and returns relevant documents to user queries regarding the uploaded document"
    docs = retriever.similarity_search(query)
    return docs


tools = [retriever_tool]

# This is an arithmetic tool which simply performs any calculation the user might want ot perform.


@tool
def math_tool(query):
    "Takes in a arithmetic equation as query and solves the equation in a step-by-step manner."
    llm_math_chain = LLMMathChain.from_llm(llm, verbose=True)
    response = llm_math_chain.run(query)

    return response


tools.append(math_tool)


# In[15]:


search = GoogleSearchAPIWrapper()

search_tool = Tool(
    name="google_search",
    description="Search Google for recent results.",
    func=search.run,
)
tools.append(search_tool)


# # Agent Logic (Generation Script)

# Vital to retain memory since that is what enables the back-forth convo
memory = ConversationBufferMemory(memory_key=memory_key, return_messages=True)


# Our custom system prompt
sys_prompt = """
You are an agent who has a second brain, namely its retrieval tool.\
You make use of this tool along with your search and math tools to answer user queries.\

Whenever given a query, follow this protocol to answer:\
1. Always call your retrieval tool to fetch the data relevant to answering the user query.\
2. Identify wether you need to use the search tool or not. ONLY USE THE SEARCH TOOL IF NO DATA IS RETURNED BY RETRIEVAL TOOL.\
3. Augment the retrieved results and answer the user query.

Follow these instructions to format your final response:
1. Be concise. 
2. Follow the protocol mentioned above AT ALL TIMES.
3. Before using the search tool as the user explicitly "NO RESULTS FOUND. WANT ME TO SEARCH THE WEB?"\
if the reply is a yes only then use the search tool otherwise do not use it.
"""


# Here we are simply wrapping the prompts to feed into the model
system_message = SystemMessage(
    content=(f"{sys_prompt}")
)
prompt = OpenAIFunctionsAgent.create_prompt(
    system_message=system_message,
    extra_prompt_messages=[MessagesPlaceholder(variable_name=memory_key)]
)


# Now we define the AGENT
agent = create_openai_functions_agent(llm=llm, tools=tools, prompt=prompt)


# This is where everything is wrapped together to form our RAG agent. RAG is just one capability enabled by our retrieval tool. Adding more tools gives more abilities
agent_executor = AgentExecutor(
    agent=agent, tools=tools, memory=memory, verbose=False)


# ============================== ADD ENDPOINT FOR THIS FUNCTION ==============================
# Here, we should fetch the context from a file. The command line argument will always just be
# the latest query. Store context in 'context/user_id/chat_id.
# We would append the new query to the context.
query = sys.argv[2]
# This function passes user queries to the model and returns the inferred response


def infer(query: str = None):
    """
    This fucntion takes in a user query and performs RAG.

    parameters:
    query: The query sent to the agent by the user.
    """
    agent_input = {'input': query}
    result = agent_executor(agent_input)

    return result['output']


if __name__ == "__main__":
    result = infer(query)
    print(result)

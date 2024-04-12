# !pip install -r data/requirements.txt

import os
import hashlib

# used to load the pdfs
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

# used to create the retrieval tool
from langchain.agents import tool

# used to create the memory
from langchain.memory import ConversationBufferMemory

# used to create the prompt template
from langchain.agents.openai_functions_agent.base import OpenAIFunctionsAgent
from langchain.agents.openai_functions_agent.base import create_openai_functions_agent
from langchain.schema import SystemMessage
from langchain.prompts import MessagesPlaceholder

# used to create the agent executor
from langchain_openai import OpenAI
from langchain.agents import AgentExecutor
from langchain_openai import ChatOpenAI


from langchain.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Optional, Type, List, Union
from langchain.prompts import PromptTemplate
from langchain.chains import LLMMathChain, LLMChain
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun, CallbackManagerForToolRun)
from langchain.memory import ConversationBufferWindowMemory
from langchain.agents import AgentType, initialize_agent, Tool, AgentExecutor, AgentOutputParser
from langchain.schema import AgentAction, AgentFinish, OutputParserException

from langchain import hub
from langchain.agents import AgentExecutor, create_openai_tools_agent


from langchain.agents import load_tools
from langchain_community.utilities import GoogleSearchAPIWrapper


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


# WE NEED TO HASH -> a convenient and efficient way to ensure that variable documents are assigned different file names
# Ensures robustness when saving indices. Always ensures each doc or combination of merged docs is assigned a unique path name
def hash_string(input_string: str = None) -> str:
    """
    Hashes a given string using SHA-256 algorithm.

    Parameters:
        input_string (str): The string to be hashed.
    """

    # Encode the string to bytes before hashing
    input_bytes = input_string.encode('utf-8')

    # Create a SHA-256 hash object
    sha256_hash = hashlib.sha256()

    # Update the hash object with the input bytes
    sha256_hash.update(input_bytes)

    # Get the hexadecimal digest of the hash
    hashed_value = sha256_hash.hexdigest()

    return hashed_value


# # VectorBase Logic (File Upload Script)

# Returns page by page doc in pyPDF wrapper
def load_document(doc_path: str = None):
    """
    Returns the pyPDF wrapped doc.

    parameters:
    doc_path: this is the path to the uploaded document
    """

    loader = PyPDFLoader(doc_path)
    doc = loader.load()

    return doc


# Creating an OpenAI embeddings object
embeddings = OpenAIEmbeddings()


# This function simply checks whether the file_name is present at folder_path
def check_file_exists(folder_path: str = None, file_name: str = None):
    """
    Checks whether file_name is present at folder_path or not.

    parameters:
    folder_path: this will be the folder which stores the db info for a PARTICULAR user.
    file_name: just the file name of the particular file at hand (hashed value). THIS IS NOT THE WHOLE file path.
    """

    file_path = os.path.join(folder_path, file_name)
    return os.path.exists(file_path)


# PLEASE CHANGE THE SAVED_DB_ROOT VARIABLE HERE ACCORDING TO YOUR PATHS!

def establish_retriever(doc_paths: List[str] = None, chunk_size: int = 1000, overlap: int = 50):
    """
    doc_paths: List of paths to the user uploaded documents.
    chunk_size: Maximum chunk size to which doc is broken into.
    overlap: The # of overlapping tokens between chunks (helps with retaining some context between chunks).

    Chunkifies the docs, creates embeddings, uploads embeddings to vector database. Saves and returns retriever.
    In case doc was already found at the user path, simply return the old retriever object.

    Whenever len(doc_paths) > 1, assume user wants to merge the docs in the database. 
    db1.merge_from(db2) collapses db2 into the index of db1 so there is no need to store db2 separately.
    """

    if not doc_paths or len(doc_paths) < 1:
        raise ValueError("Must give at least one document")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=overlap)

    # extract the document names from the doc paths provided by the user
    doc_names = [doc.split('/')[-1].split('.')[0] for doc in doc_paths]

    # CHANGE THIS TO YOUR ROOT (the path to the folder where db info for ALL USERS is stored)
    saved_db_root = 'indices/'

    # Combine all names for hashing
    saved_db_name = ('_').join(doc_names)

    # This is the name of the db index for the current doc paths supplied by the user
    saved_db_value = hash_string(saved_db_name)

    # This is the path to the db file where we save the vectorstore index created by this function call (same as saved_db_value but this is the full path with root included)
    saved_db_path = os.path.join(saved_db_root, saved_db_value)

    # If this saved_db_name already exists at saved_db_value, then simply fetch the db from the index and return it
    if check_file_exists(saved_db_root, saved_db_value):
        return FAISS.load_local(saved_db_path, embeddings, allow_dangerous_deserialization=True)

    # If this is a new set of documents, then create and merge the dbs and then save

    # Since all merged dbs need to merge onto some existing db, our db_base will be that special db (its the first doc from doc_paths for simplicity)
    db_base = None

    for i, doc_path in enumerate(doc_paths):
        doc = load_document(doc_path)
        texts = text_splitter.split_documents(doc)
        db = FAISS.from_documents(texts, embeddings)

        # Set the first db to db_base. Otherwise, merge current db with db_base
        if i == 0:
            db_base = db
        else:
            # Merge current db object with the base db object.
            db_base.merge_from(db)

    # Save the db object every time a new one is created
    db_base.save_local(saved_db_path)
    # db_base = db_base.as_retriever()
    return db_base

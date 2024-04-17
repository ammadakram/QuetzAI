import datetime
import hashlib
import json
import os
import sys
import warnings
from flask import Flask, request, jsonify
from flask_cors import CORS
import pyrebase
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
from typing import List
from langchain.agents import (
    AgentExecutor, Tool, tool
)
from langchain.agents.openai_functions_agent.base import (
    OpenAIFunctionsAgent, create_openai_functions_agent
)
from langchain.chains import LLMMathChain
from langchain_community.utilities import GoogleSearchAPIWrapper
from langchain.document_loaders import PyPDFLoader
from langchain.memory import ConversationBufferMemory
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.prompts import MessagesPlaceholder
from langchain.schema import SystemMessage
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS


warnings.filterwarnings("ignore")
# Setup firebase.
firebaseConfig = {
    "apiKey": "AIzaSyBvf-wZjb94qHmYtRBM5GjoJeVcwCZVy-4",

    "authDomain": "quetzai.firebaseapp.com",

    "databaseURL": "https://quetzai-default-rtdb.asia-southeast1.firebasedatabase.app",

    "projectId": "quetzai",

    "storageBucket": "quetzai.appspot.com",

    "messagingSenderId": "534872798640",

    "appId": "1:534872798640:web:52374c8ab8ef4bebcbd275",

    "measurementId": "G-CLEPLGY8NG"

}

cred = credentials.Certificate(
    "quetzai-firebase-adminsdk-cejv1-82218a0b2a.json")
firebase_admin.initialize_app(cred, {
    "storageBucket": "quetzai.appspot.com"
})
bucket = storage.bucket()


def check_file_exists(folder_path: str = None, file_name: str = None):
    """
    Checks whether file_name is present at folder_path or not.

    parameters:
    folder_path: this will be the folder which stores the db info for a PARTICULAR user.
    file_name: just the file name of the particular file at hand (hashed value). THIS IS NOT THE WHOLE file path.
    """

    file_path = os.path.join(folder_path, file_name)
    return os.path.exists(file_path)


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


def load_document(doc_path: str = None):
    """
    Returns the pyPDF wrapped doc.

    parameters:
    doc_path: this is the path to the uploaded document
    """

    loader = PyPDFLoader(doc_path)
    doc = loader.load()

    return doc


def vectorstore(chat_id: str, doc_paths: List[str] = None, chunk_size: int = 1000, overlap: int = 50):
    # Initial setup.
    if not doc_paths or len(doc_paths) < 1:
        raise ValueError("Must give at least one document")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=overlap)

    # extract the document names from the doc paths provided by the user
    doc_names = [doc.split('/')[-1].split('.')[0] for doc in doc_paths]

    # CHANGE THIS TO YOUR ROOT (the path to the folder where db info for ALL USERS is stored)
    saved_db_root = f'indices/{chat_id}'

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


def load_history(filename, agent_executor: AgentExecutor):
    human_dict = {}
    ai_dict = {}
    counter = 0

    with open(filename, 'r') as file:
        for line in file:
            if line.startswith('Human:'):
                key = f'message{counter}'
                human_dict[key] = line[len('Human: '):].strip()
            elif line.startswith('AI:'):
                key = f'response{counter}'
                ai_dict[key] = line[len('AI: '):].strip()
                counter += 1  # Increment the counter after an AI message completes a cycle
    # Load the history into the agent.
    for idx in range(len(human_dict.keys())):
        key_human = f"message{idx}"
        key_ai = f"response{idx}"
        agent_executor.memory.save_context({"input": human_dict[key_human]}, {
                                           "output": ai_dict[key_ai]})


def save_history(data, filename):
    with open(filename, 'w') as file:
        for idx, message in enumerate(data['history']):
            if idx % 2 == 0:
                file.write(f"Human: {message.content}\n")
            else:
                file.write(f"AI: {message.content}\n")


def generation(chat_id: str, paths: str, query: str):
    retriever = vectorstore(chat_id, [paths]).as_retriever()
    title_query = "Give me a very short title describing the conversation so far."

    # This is the retrieval tool that searches the documents and fetches chunks most similar to user query using FAISS. DO NOT CHANGE THIS FUNCTION DEFINITION SINCE THIS IS EXPECTED BY LANGCHAIN API.
    @tool
    def retriever_tool(query):
        "Searches and returns relevant documents to user queries regarding the uploaded document. In case the user asks for a summary, return all chunks."
        docs = retriever.get_relevant_documents(query)
        return docs

    tools = [retriever_tool]

    # This is an arithmetic tool which simply performs any calculation the user might want ot perform.

    @tool
    def math_tool(query):
        "Takes in a arithmetic equation as query and solves the equation in a step-by-step manner."
        llm_math_chain = LLMMathChain.from_llm(llm, verbose=False)
        response = llm_math_chain.run(query)

        return response

    tools.append(math_tool)

    search = GoogleSearchAPIWrapper()

    search_tool = Tool(
        name="google_search",
        description="Search Google for recent results.",
        func=search.run,
    )
    tools.append(search_tool)

    # # Agent Logic (Generation Script)

    # Vital to retain memory since that is what enables the back-forth convo
    memory = ConversationBufferMemory(
        memory_key=memory_key, return_messages=True)

    # Our custom system prompt
    now = datetime.datetime.now()
    current_year = now.year
    sys_prompt = f"""
    The CURRENT_YEAR IS: {current_year}. 
    You are an agent who has a second brain, namely its retrieval tool.\
    You make use of this tool along with your search and math tools to answer user queries.\

    Whenever given a query, follow this protocol to answer:\
    1. Always call your retrieval tool to fetch the data relevant to answering the user query.\
    2. Identify wether you need to use the search tool or not. You can use search_tool for these 2 cases:\
        i. ALWAYS USE THE SEARCH TOOL IF USER QUERY ASKS ABOUT CURRENT EVENTS (remeber that it is {current_year} today).\
        ii. ALWAYS USE THE SEARCH TOOL IF NO DATA IS RETURNED BY RETRIEVAL TOOL.\
    3. Augment the retrieved results and answer the user query.

    Follow these instructions to format your final response:
    1. Be concise. 
    2. Follow the protocol mentioned above AT ALL TIMES.
    3. Before using the search tool ask the user explicitly.\
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
        agent=agent, tools=tools, memory=memory, verbose=True)

    if not os.path.exists("history"):
        os.mkdir("history")

    print("Received file path: ", paths)
    history_file_path = f"history/{chat_id}"
    if os.path.exists(history_file_path):
        load_history(history_file_path, agent_executor)

    agent_input = {'input': query}
    result = agent_executor(agent_input)
    # Don't update history if the title query is passed.
    if query == title_query:
        return result['output']
    # Save the history
    history_dict = agent_executor.memory.load_memory_variables({})
    save_history(history_dict, history_file_path)
    return result['output']


# Server setup:
app = Flask(__name__)
# Enable CORS for all domains on all routes
CORS(app, resources={r"/*": {"origins": "*"}})
# Miscellaneous setup
openai_api_key = open("API_key.txt").read().strip()
os.environ["OPENAI_API_KEY"] = openai_api_key
os.environ["SERPAPI_API_KEY"] = '4bde37c74068633153b825cb3ff392ee3a6697a630674d5abb5d55be50f58a49'
os.environ["GOOGLE_API_KEY"] = "AIzaSyDjYdIvnFq1Uw2DW7C5sj8fbXCl9HfF89c"
os.environ["GOOGLE_CSE_ID"] = "74e790ea0cfaf4154"
memory_key = "history"
embeddings = OpenAIEmbeddings()
llm = ChatOpenAI(temperature=0, openai_api_key=openai_api_key,
                 model="gpt-3.5-turbo")


def download_relevant_file(path: str):
    if os.path.exists(path):
        return "File already downloaded..."
    blob = bucket.blob(path)
    dir_path = "/".join(path.split("/")[:-1])
    print(dir_path)
    os.makedirs(dir_path, exist_ok=True)
    with open(path, "wb") as file_obj:
        blob.download_to_file(file_obj)
    return "Successfully downloaded file locally."


@app.route('/download', methods=['GET'])
def download():
    chat_id = request.args.get('id')
    path = request.args.get('path')
    if os.path.exists(f"indices/{chat_id}"):
        return jsonify(result="Index already created", error="")
    try:
        downloaded = download_relevant_file(path)
        print("Downloaded file!")
        index_made = vectorstore(chat_id, [path])  # Direct function call
        print("Created index!")
        return jsonify(result="Index has been made.", error="")
    except Exception as e:
        return jsonify(result="", error=str(e))


@app.route('/generate', methods=['GET'])
def generate():
    chat_id = request.args.get('id')
    path = request.args.get('path')
    query = request.args.get('query')
    title_generated = os.path.exists(f"history/{chat_id}")

    try:
        result = generation(chat_id, path, query)  # Direct function call
        print("Received output from generation function: ", result)
        title = ""
        if not title_generated:
            title = generation(
                chat_id, path, "Give me a very short title describing the conversation so far.")  # Another call
        return jsonify(result=result, error="", title=title)
    except Exception as e:
        return jsonify(result="", error=str(e), title="")


if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(debug=True, host="0.0.0.0", port=8000)

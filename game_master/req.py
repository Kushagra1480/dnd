from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import ChatOpenAI
from pydantic import BaseModel
import logging

# SERVER ---------------------------------------------------------------------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Post Request Structure
class Message(BaseModel): 
    role: str
    content: str

class Conversation(BaseModel):
    messages: List[Message]


@app.post("/play/{room_id}/init")
def initialize(room_id:str):
    logger.info(f"Initializing Game for Room ID : {room_id}")
    # load doc
    try:
        pass #load doc from database
    except Exception as e:
        logger.error(e)



@app.post("/play/{room_id}")
def response(room_id:str,conversation:Conversation):
    logger.info(f"Recieved conversation from Room ID : {room_id}")
    theme, context, mood_setting = get_room_config(room_id=room_id)
    curr_prompt = system_message_prompt.format(theme= theme, context=context, mood_setting=mood_setting)
    messages = [curr_prompt] + generate_conversation_template(conversation=conversation.messages)
    result = chat.invoke(input=messages)
    return {"room_id": room_id, "Game_Master": result}


# DATA BASE FETCHING -----------------------------------------------

TEST_DATA = {
    "room_id" : "123",
    "Theme" : "harry potter series",
    "context" : "exploring to the magic forest.",
    "mood_setting" : "witty, funny, aggressive"
}


def get_room_config(room_id:str)->list:
    # fetch from database TODO
    
    return [TEST_DATA["Theme"],TEST_DATA["context"],TEST_DATA["mood_setting"]]


# CONVERSATION MODEL -----------------------------------------------
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langchain_core.prompts.prompt import PromptTemplate
from langchain_core.prompts.chat import SystemMessagePromptTemplate

from dotenv import load_dotenv
import openai
import os


load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
TEMPERATURE = 0


ROLE_MSG_TEMPLATE_MAP = {
    "assisant": AIMessage,
    "human": HumanMessage,
    "system": SystemMessage
}

chat = ChatOpenAI(temperature = TEMPERATURE)
prompt_template = """ As a Game Master in the Game of dungons and Dragons, You a setting up a game for the players. Theme:{theme}. Ask your question to the players.
Context : {context}
Tone: {mood_setting}
SETUP:
"""
prompt = PromptTemplate(template= prompt_template, input_variables= ["theme", "context", "mood_setting"])
system_message_prompt = SystemMessagePromptTemplate(prompt=prompt)


def generate_conversation_template(conversation):
    chain = []
    for message in conversation:
        chain.append(ROLE_MSG_TEMPLATE_MAP[message.role](content = message.content))
    return chain

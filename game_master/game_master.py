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


@app.post("/play/{room_id}/generateCharacters")
def initialize(room_id:str):
    logger.info(f"Generating Characters for Room ID : {room_id}")
    # load doc TODO
    _,context,_ = get_room_config(room_id=room_id)
    prompt = initialize_prompt_template.format(context=context)
    result = chat.invoke(input=[prompt])
    return {"room_id": room_id, "Game_Master": result}


@app.post("/play/{room_id}")
def response(room_id:str,conversation:Conversation):
    logger.info(f"Recieved conversation from Room ID : {room_id}")
    theme, context, mood_setting = get_room_config(room_id=room_id)
    curr_prompt = system_message_prompt.format(theme= theme, context=context, mood_setting=mood_setting)
    messages = [curr_prompt] + [player_context_prompt(room_id=room_id)] + generate_conversation_template(conversation=conversation.messages)
    result = chat.invoke(input=messages)
    response = {"room_id": room_id, "Game_Master": result.dict()["content"]}
    # print(response)
    return response


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




## GAME ------


# Initialize Character DATA
character_prompt_template = """ generate a list of 5 races and classes of players based on the given plot: {context}.
    output format json 
    races: [(race : name, description: desc),.........]
    class: [(class : name, description: desc),.........]
    """
character_prompt = PromptTemplate(template= character_prompt_template, input_variables= ["context"])
initialize_prompt_template = SystemMessagePromptTemplate(prompt=character_prompt)

Player_Example = {
    "name":"ifliit",
    "class": "Warrior",
    "race": "elf",   
    "backstory":""
}






# Load Character Data as prompt

load_character_prompt_template = """\n\nPlayers Playing this Game : {character_data}"""
load_character_prompt = PromptTemplate(template=load_character_prompt_template, input_variables= ["character_data"])
system_load_character_prompt = SystemMessagePromptTemplate(prompt=load_character_prompt)


DUMMY_CHARACTER_DATA = """
    Player 1
    Name: draco
    class:Ranger (Skilled in wilderness survival and tracking, rangers excel at exploring and navigating through the magic forest.)
    race: elf (Graceful and mystical beings with a deep connection to nature, perfect for exploring the magic forest.)
    backstory: child prodigy, high magic capacity 
    

    Player 2
    Name: nomu
    class: Bard (Charismatic performers and storytellers, bards can use their talents to charm and entertain the magical creatures of the forest during their exploration)
    race: Gnome (Small and clever creatures with a knack for tinkering and a natural curiosity that drives them to explore the mysteries of the magic forest.)
    backstory: poor family, steals from rich gives to poor
"""

def player_context_prompt(room_id):
    #load data from db TODO
    character_data = DUMMY_CHARACTER_DATA # this will be updated by the front end. 
    return system_load_character_prompt.format(character_data=character_data)




## voice tts
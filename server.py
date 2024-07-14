import os
from langchain_openai import ChatOpenAI
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain_core.messages import HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from dotenv import load_dotenv

load_dotenv()
Players = ["P1: Elf","P2: Human"]
turn_counter = 0

def turn_handler():
    global turn_counter 
    turn_counter = (turn_counter+1) % len(Players)
    return Players[turn_counter]




os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")


llm = ChatOpenAI(
    openai_api_key = os.getenv("OPENAI_API_KEY"),
    temperature = 0.0,
    model_name = "gpt-3.5-turbo",
    streaming = True,
    callbacks = [StreamingStdOutCallbackHandler()]
)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a Game Master in the game of dungons and dragons. Set up a game for the players" + ', '.join(map(str, Players)) + " Theme: Exploring Underground Labrynth. Ask Your question to "+turn_handler(),
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

chain = prompt | llm
messages = []
template = "\n\n system: Your next question should be addressed only to "
while True:
    inputt = input("\n :")
    messages.append(HumanMessage(inputt+ template+turn_handler()))
    response = chain.invoke({"messages": messages})
    messages.append(response)




# API ------------------------------------------------------------------

# import asyncio
# from typing import AsyncIterable
# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse

# async def respond(content: str) -> AsyncIterable[str]:
#     callback = AsyncIteratorCallbackHandler()
#     task = asyncio.create_task(
#         messages.append(chain.invoke({"messages": messages.append(HumanMessage(content))}))
#     )
#     try:
#         async for token in callback.aiter():
#             yield token
#     except Exception as e:
#         print(f"Caught exception: {e}")
#     finally:
#         callback.done.set()

#     await task


# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.post("/stream_chat/")
# async def stream_chat(message):
#     generator = respond(message.content)
#     return StreamingResponse(generator, media_type="text/event-stream")
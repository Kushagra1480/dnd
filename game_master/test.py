import requests
import json
url = "http://127.0.0.1:8000/play/123"
def play_game_test():
    convo =[]
    while True:
        inputstr = input ("\n : ")
        message = { "role": "human",
                    "content": inputstr}
        convo.append(message)
        converstaion = {"messages":convo}
        response = requests.post(url=url,json=converstaion)
        ai = response.json()["Game_Master"]
        print("\n\nGame Master: " + ai)
        ai_message = {"role":"assisant",
                    "content": ai}
        convo.append(ai_message)



character_selection_url = "http://127.0.0.1:8000/play/123/generateCharacters"
def generate_character_test():
    response = requests.post(url=character_selection_url)
    game_master = response.json()["Game_Master"]# type str
    game_master = json.loads(game_master)
    print(game_master)
    with open('result.json', 'w') as fp:
        json.dump(game_master, fp)

play_game_test()
import requests
url = "http://127.0.0.1:8000/play/123"

convo =[]
while True:
    inputstr = input ("\n : ")
    message = { "role": "human",
                "content": inputstr}
    convo.append(message)
    converstaion = {"messages":convo}
    response = requests.post(url=url,json=converstaion)
    ai = response.json()["Game_Master"]["content"]
    print(ai)
    ai_message = {"role":"assisant",
                  "content": ai}
    convo.append(ai_message)


import { getMessages, addMessage, resetUserState } from "./chatStore";


const playUrl = "http://127.0.0.1:8086/play/";

function preprocess_coversations(messages) {
    const conversation = {
        "messages": []
    };
    for (let i = 0; i < messages.length; i++) {
        if(messages[i].user == "Game Master") {
            conversation.messages.push({"role": "assistant" ,
            "content": messages[i].text});
        }
        else{
        conversation.messages.push({"role": "human" ,
            "content": messages[i].user+": "+messages[i].text});
        }
    }
    return conversation;
}

async function fetchGameMasterResponse(roomId) {
  const url = new URL(playUrl+roomId+"/");
  const messages = getMessages(roomId);
  const conversation = preprocess_coversations(messages);
  // Post the conversation to the AI
  const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(conversation),
      headers: {
          'Content-Type': 'application/json'
      }
  }).then(res=>res.json());
  return response;

}
export async function addGameMasterMessage(roomId) {
  const response = await fetchGameMasterResponse(roomId);
  resetUserState(roomId);
  addMessage(roomId, { text: response["content"], user: "Game Master" });
}
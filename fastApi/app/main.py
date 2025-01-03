from fastapi import FastAPI, Query, HTTPException
from pydantic import BaseModel
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch

app = FastAPI()

# Load the Hugging Face chatbot model
MODEL_NAME = "facebook/blenderbot-400M-distill"  # Replace with any suitable Hugging Face chatbot model
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME)

class ChatResponse(BaseModel):
    prompt: str
    response: str

@app.get("/chat", response_model=ChatResponse)
def chat_with_model(prompt: str = Query(..., description="The prompt to send to the chatbot model")):
    if not prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    try:
        # Encode the prompt
        inputs = tokenizer(prompt, return_tensors="pt")
        # Generate a response
        outputs = model.generate(inputs["input_ids"], max_length=100, num_return_sequences=1, pad_token_id=tokenizer.eos_token_id)
        # Decode the response
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        # print(f"Prompt: {prompt}")
        # print(f"Response: {response}")
        # print(f"inputs : {inputs}")
        # print(f"outputs : {outputs})")
        return {"prompt": prompt, "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating chatbot response: {e}")

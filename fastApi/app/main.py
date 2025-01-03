from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from transformers import AutoProcessor, AutoModelForCTC
import torch
import librosa

app = FastAPI()

# Load the pre-trained model and processor
processor = AutoProcessor.from_pretrained("tanmoyio/wav2vec2-large-xlsr-bengali")
model = AutoModelForCTC.from_pretrained("tanmoyio/wav2vec2-large-xlsr-bengali")


@app.post("/speech-to-text/")
async def speech_to_text(audio: UploadFile = File(...)):
    try:
        # Ensure the uploaded file is an audio file
        if not audio.filename.endswith((".wav", ".mp3")):
            return JSONResponse(
                status_code=400, content={"error": "Invalid file format. Please upload a .wav or .mp3 file"}
            )

        # Save the uploaded file temporarily
        file_path = f"temp_{audio.filename}"
        with open(file_path, "wb") as temp_file:
            temp_file.write(await audio.read())

        # Load audio and preprocess
        speech, rate = librosa.load(file_path, sr=16000)  # Ensure 16kHz sampling rate
        input_values = processor(speech, sampling_rate=16000, return_tensors="pt", padding=True).input_values

        # Perform inference
        with torch.no_grad():
            logits = model(input_values).logits
            predicted_ids = torch.argmax(logits, dim=-1)

        # Decode the predicted transcription
        transcription = processor.batch_decode(predicted_ids)[0]

        # Clean up the temporary file
        import os
        os.remove(file_path)

        return {"transcription": transcription}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.get("/")
def root():
    return {"message": "Welcome to Bangla Speech-to-Text API!"}

from transformers import AutoModelForCausalLM, AutoTokenizer
from min_dalle import MinDalle
import torch
import base64
from io import BytesIO
from PIL import Image
from fastapi import File, UploadFile
from pydub import AudioSegment
import speech_recognition as sr
import os
import time

print("Инициализация текстовой модели и токенизатора...")
#EleutherAI/gpt-j-6B слишком тяжёлая (24Гб)
#EleutherAI/gpt-neo-2.7B тоже тяжёлая (10Гб)
#distilgpt2 слишком простая и неточная (300Мб)
text_model_name = "gpt2-medium"
text_tokenizer = AutoTokenizer.from_pretrained(text_model_name)
text_model = AutoModelForCausalLM.from_pretrained(text_model_name)
def response_message_text(user_message):
    inputs = text_tokenizer(user_message, return_tensors="pt")
    outputs = text_model.generate(**inputs, max_new_tokens=100)
    response = text_tokenizer.decode(outputs[0], skip_special_tokens=True)
    return response

print("Инициализация графической модели...")
img_model = MinDalle(
    models_root='./pretrained',
    dtype=torch.float32,
    device="cuda" if torch.cuda.is_available() else "cpu",
    is_mega=False,
    is_reusable=True
)
def response_message_img(user_message):
    image = img_model.generate_image(
        text=user_message,
        seed=-1,
        grid_size=1,
        is_seamless=False,
        temperature=1.0,
        top_k=256,
        supercondition_factor=16,
        is_verbose=True
    )
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    return img_str

def response_message_audio(user_audio_file: UploadFile = File(...)):
    file_location = f'temp_{user_audio_file.name}'
    temp_wav_path = None
    with open(file_location, 'wb') as file_object:
        file_object.write(user_audio_file.file.read())
    file_extension = user_audio_file.name.split('.')[-1].lower()
    try:
        if file_extension != 'wav':
            audio = AudioSegment.from_file(file_location, format=file_extension)
            audio = audio.set_channels(1).set_frame_rate(16000)
            temp_wav_path = 'temp.wav'
            audio.export(temp_wav_path, format='wav')
        else:
            temp_wav_path = file_location
        recognizer = sr.Recognizer()
        with sr.AudioFile(temp_wav_path) as source:
            audio_data = recognizer.record(source)
            try:
                text_from_audio = recognizer.recognize_google(audio_data, language='ru-RU')
                return { "text": text_from_audio }
            except sr.UnknownValueError:
                return { "text": 'Не удалось распознать аудио!' }
            except sr.RequestError as e:
                return { "text": f'Возникла неожиданная ошибка: {e}' }
    finally:
        try:
            if temp_wav_path and os.path.exists(temp_wav_path):
                os.remove(temp_wav_path)
            if os.path.exists(file_location):
                os.remove(file_location)
        except:
            print("Возникла проблема при удалении временного файла.")
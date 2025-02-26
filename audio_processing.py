import speech_recognition as sr

def process_audio(audio_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = recognizer.record(source)
    
    try:
        text = recognizer.recognize_google(audio, language='zh-CN')
        return text
    except sr.UnknownValueError:
        return "无法识别音频"
    except sr.RequestError:
        return "无法连接到服务"

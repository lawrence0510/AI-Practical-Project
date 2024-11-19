from flask import Flask, request
from flask_restx import Api, Resource, Namespace, reqparse
from flask_cors import CORS
import os
from pytube import YouTube
import moviepy.editor as mp
from googletrans import Translator
from gtts import gTTS
import speech_recognition as sr

app = Flask(__name__)
CORS(app)

api = Api(app, title="人工智慧實務專題API", description="組員：吳堃豪、許馨文")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 定義 parsers
download_parser = reqparse.RequestParser()
download_parser.add_argument('url', type=str, required=True, help="YouTube URL is required")

separate_parser = reqparse.RequestParser()
separate_parser.add_argument('video', type=str, required=True, help="Video file path is required")

combine_parser = reqparse.RequestParser()
combine_parser.add_argument('video', type=str, required=True, help="Video without audio path is required")
combine_parser.add_argument('audio', type=str, required=True, help="Audio file path is required")

translate_parser = reqparse.RequestParser()
translate_parser.add_argument('text', type=str, required=True, help="Text is required")
translate_parser.add_argument('target_language', type=str, required=True, help="Target language code is required")

tts_parser = reqparse.RequestParser()
tts_parser.add_argument('text', type=str, required=True, help="Text is required")
tts_parser.add_argument('lang', type=str, required=True, help="Language code is required")

speech_parser = reqparse.RequestParser()
speech_parser.add_argument('audio', type=str, required=True, help="Audio file path is required")

# Namespaces
youtube_ns = Namespace('youtube', description="YouTube相關功能")
video_audio_ns = Namespace('video_audio', description="影片與音訊處理功能")
text_audio_ns = Namespace('text_audio', description="文字與語音處理功能")

# YouTube Namespace
@youtube_ns.route('/download_youtube_video')
class DownloadYoutubeVideo(Resource):
    @youtube_ns.expect(download_parser)
    def post(self):
        args = download_parser.parse_args()
        url = args['url']

        try:
            yt = YouTube(url)
            caption = yt.captions.get_by_language_code('en')
            if caption:
                subtitle = caption.generate_srt_captions()
                with open(f"{UPLOAD_FOLDER}/subtitle.srt", "w", encoding="utf-8") as f:
                    f.write(subtitle)
                video = yt.streams.filter(progressive=True, file_extension='mp4').first()
                video_path = video.download(UPLOAD_FOLDER)
                return {"video_path": video_path, "subtitle_path": f"{UPLOAD_FOLDER}/subtitle.srt"}
            else:
                video = yt.streams.filter(progressive=True, file_extension='mp4').first()
                video_path = video.download(UPLOAD_FOLDER)
                return {"video_path": video_path, "subtitle_path": None}
        except Exception as e:
            return {"error": str(e)}, 500

# Video and Audio Namespace
@video_audio_ns.route('/separate_video_audio')
class SeparateVideoAudio(Resource):
    @video_audio_ns.expect(separate_parser)
    def post(self):
        args = separate_parser.parse_args()
        video_path = args['video']

        try:
            video = mp.VideoFileClip(video_path)
            video_without_audio = video.without_audio()
            video_without_audio_path = f"{UPLOAD_FOLDER}/video_without_audio.mp4"
            audio_path = f"{UPLOAD_FOLDER}/audio.mp3"

            video_without_audio.write_videofile(video_without_audio_path, codec="libx264")
            video.audio.write_audiofile(audio_path)
            
            return {"video_without_audio_path": video_without_audio_path, "audio_path": audio_path}
        except Exception as e:
            return {"error": str(e)}, 500

@video_audio_ns.route('/combine_video_audio')
class CombineVideoAudio(Resource):
    @video_audio_ns.expect(combine_parser)
    def post(self):
        args = combine_parser.parse_args()
        video_path = args['video']
        audio_path = args['audio']

        try:
            video = mp.VideoFileClip(video_path)
            audio = mp.AudioFileClip(audio_path)
            video_with_audio = video.set_audio(audio)
            output_path = f"{UPLOAD_FOLDER}/video_with_audio.mp4"
            video_with_audio.write_videofile(output_path, codec="libx264", audio_codec="aac")
            return {"output_path": output_path}
        except Exception as e:
            return {"error": str(e)}, 500

# Text and Audio Namespace
@text_audio_ns.route('/translate')
class Translate(Resource):
    @text_audio_ns.expect(translate_parser)
    def post(self):
        args = translate_parser.parse_args()
        text = args['text']
        target_language = args['target_language']

        try:
            translator = Translator()
            translated_text = translator.translate(text, dest=target_language).text
            return {"translated_text": translated_text}
        except Exception as e:
            return {"error": str(e)}, 500

@text_audio_ns.route('/text_to_speech')
class TextToSpeech(Resource):
    @text_audio_ns.expect(tts_parser)
    def post(self):
        args = tts_parser.parse_args()
        text = args['text']
        lang = args['lang']

        try:
            tts = gTTS(text=text, lang=lang)
            audio_path = f"{UPLOAD_FOLDER}/output_audio.mp3"
            tts.save(audio_path)
            return {"audio_path": audio_path}
        except Exception as e:
            return {"error": str(e)}, 500

@text_audio_ns.route('/speech_to_text')
class SpeechToText(Resource):
    @text_audio_ns.expect(speech_parser)
    def post(self):
        args = speech_parser.parse_args()
        audio_path = args['audio']

        try:
            recognizer = sr.Recognizer()
            with sr.AudioFile(audio_path) as source:
                audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            return {"text": text}
        except Exception as e:
            return {"error": str(e)}, 500

# 加入 namespaces 到主 API
api.add_namespace(youtube_ns, path='/youtube')
api.add_namespace(video_audio_ns, path='/video_audio')
api.add_namespace(text_audio_ns, path='/text_audio')

if __name__ == "__main__":
    app.run(debug=True, port=5003)

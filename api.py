from flask import Flask, jsonify, request, send_file
from flask_restx import Api, Resource, reqparse
from pytube import YouTube
from googletrans import Translator
from moviepy.editor import *
from pydub import AudioSegment
import os
from gtts import gTTS
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
api = Api(app, title="人工智慧實務專題api", description="組員：吳堃豪、許馨文")

# Initialize Google Translator
translator = Translator()

# YouTube Namespace
yt_ns = api.namespace('YouTube', description='YouTube相關api')
# Google TTS Namespace
google_ns = api.namespace('Google', description='Google TTS相關api')

# Parsers for each API
get_cc_parser = reqparse.RequestParser()
get_cc_parser.add_argument('yt_url', type=str, required=True, help='YouTube video URL')

download_video_parser = reqparse.RequestParser()
download_video_parser.add_argument('yt_url', type=str, required=True, help='YouTube video URL')

translate_text_parser = reqparse.RequestParser()
translate_text_parser.add_argument('text', type=str, required=True, help='Text to translate')
translate_text_parser.add_argument('target_lang', type=str, required=True, help='Target language code')

text_to_speech_parser = reqparse.RequestParser()
text_to_speech_parser.add_argument('text', type=str, required=True, help='Text to convert to speech')

merge_video_audio_parser = reqparse.RequestParser()
merge_video_audio_parser.add_argument('video', type=str, required=True, help='Video file')
merge_video_audio_parser.add_argument('audio', type=str, required=True, help='Audio file')

@app.route('/')
def home():
    '''首頁顯示 API 說明'''
    return jsonify({"message": "Welcome to the YouTube and TTS Processing API", "endpoints": {
        "/YouTube/get_cc": "Fetch English subtitles if available",
        "/YouTube/download_video": "Download video and split audio",
        "/YouTube/translate_text": "Translate text to target language",
        "/TTS/text_to_speech": "Convert text to speech (MP3)",
        "/YouTube/merge_video_audio": "Merge video and audio files"
    }})

# 功能 1: 爬取 YouTube 字幕
@yt_ns.route('/get_cc')
class GetCC(Resource):
    @yt_ns.expect(get_cc_parser)
    def post(self):
        args = get_cc_parser.parse_args()
        yt_url = args['yt_url']
        yt = YouTube(yt_url)

        # Check for English captions
        if 'en' in yt.captions:
            caption = yt.captions['en']
            cc_text = caption.generate_srt_captions()
            return jsonify({"caption": cc_text})
        else:
            return jsonify({"message": "No English subtitles available."})

# 功能 2: 下載影片並分離音軌與影像
@yt_ns.route('/download_video')
class DownloadVideo(Resource):
    @yt_ns.expect(download_video_parser)
    def post(self):
        args = download_video_parser.parse_args()
        yt_url = args['yt_url']
        yt = YouTube(yt_url)
        video_stream = yt.streams.filter(progressive=True, file_extension='mp4').first()
        video_path = video_stream.download(filename="downloaded_video.mp4")

        # Split audio
        video = VideoFileClip(video_path)
        audio_path = "audio.mp3"
        video.audio.write_audiofile(audio_path)

        return jsonify({
            "video_path": video_path,
            "audio_path": audio_path
        })

# 功能 3: 使用 Google 翻譯
@google_ns.route('/translate_text')
class TranslateText(Resource):
    @google_ns.expect(translate_text_parser)
    def post(self):
        args = translate_text_parser.parse_args()
        text = args['text']
        target_lang = args['target_lang']
        translation = translator.translate(text, dest=target_lang)
        return jsonify({"translated_text": translation.text})

# 功能 4: 使用 Google TTS
@google_ns.route('/text_to_speech')
class TextToSpeech(Resource):
    @google_ns.expect(text_to_speech_parser)
    def post(self):
        args = text_to_speech_parser.parse_args()
        text = args['text']
        tts = gTTS(text=text, lang='en')
        tts.save("output.mp3")
        return send_file("output.mp3", as_attachment=True)

# 功能 5: 合併影片和音軌
@yt_ns.route('/merge_video_audio')
class MergeVideoAudio(Resource):
    @yt_ns.expect(merge_video_audio_parser)
    def post(self):
        args = merge_video_audio_parser.parse_args()
        video_file = request.files['video']
        audio_file = request.files['audio']
        
        video = VideoFileClip(video_file)
        audio = AudioFileClip(audio_file)
        final_video = video.set_audio(audio)
        output_path = "final_video.mp4"
        final_video.write_videofile(output_path)

        return send_file(output_path, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003, debug=True)
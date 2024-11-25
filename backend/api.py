#openai整理大綱input:srt, output:String(大綱)
from dotenv import load_dotenv
from flask import Flask, request
from flask_restx import Api, Resource, Namespace, reqparse
from flask_cors import CORS
import os
from openai import OpenAI
import moviepy.editor as mp
from gtts import gTTS
import speech_recognition as sr

app = Flask(__name__)
CORS(app)
load_dotenv()
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

summarize_parser = reqparse.RequestParser()
summarize_parser.add_argument('text', type=str, required=True, help="Summarize Text is required")

# Namespaces
youtube_ns = Namespace('youtube', description="YouTube相關功能")
video_audio_ns = Namespace('video_audio', description="影片與音訊處理功能")
text_audio_ns = Namespace('text_audio', description="文字與語音處理功能")
openAI_ns = Namespace('openAI', description="OpenAI相關功能")

# YouTube Namespace
from yt_dlp import YoutubeDL

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@youtube_ns.route('/download_youtube_audio')
class DownloadYoutubeAudio(Resource):
    @youtube_ns.expect(download_parser)
    def post(self):
        args = download_parser.parse_args()
        url = args['url']

        try:
            # 確保下載資料夾存在
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)

            # 設定 yt-dlp 的參數
            ydl_opts = {
                'outtmpl': os.path.join(UPLOAD_FOLDER, '%(title)s.%(ext)s'),  # 儲存音訊的格式
                'format': 'bestaudio/best',  # 只下載最佳音質的音訊
                'writesubtitles': True,  # 啟用字幕下載
                'subtitleslangs': ['all'],  # 下載所有可用語言的字幕
                'postprocessors': [
                    {
                        'key': 'FFmpegExtractAudio',  # 確保只輸出音訊
                        'preferredcodec': 'mp3',  # 音訊格式為 mp3
                        'preferredquality': '192',  # 音質選擇 192 kbps
                    }
                ],
                'skip_download': False,  # 確保下載音訊
            }

            # 使用 yt_dlp 提取影片資訊並下載音訊
            with YoutubeDL(ydl_opts) as ydl:
                info_dict = ydl.extract_info(url, download=True)
                audio_path = os.path.join(UPLOAD_FOLDER, f"{info_dict['title']}.mp3")

                # 收集字幕資訊
                subtitles = []
                if 'subtitles' in info_dict and info_dict['subtitles']:
                    for lang, subtitle_list in info_dict['subtitles'].items():
                        if subtitle_list:
                            for subtitle in subtitle_list:
                                subtitles.append({
                                    "lang": lang,
                                    "url": subtitle['url']  # 保存字幕下載 URL
                                })

                return {
                    "audio_path": audio_path,
                    "subtitles": subtitles
                }

        except Exception as e:
            return {"error": str(e)}, 500
        
@youtube_ns.route('/fetch_video_info')
class FetchVideoInfo(Resource):
    @youtube_ns.expect(download_parser)
    def post(self):
        args = download_parser.parse_args()
        url = args['url']

        try:
            # 使用 yt_dlp 提取影片資訊
            ydl_opts = {
                'quiet': True,  # 不輸出到控制台
                'skip_download': True  # 不下載影片，只提取資訊
            }

            with YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(url, download=False)  # 提取資訊
                title = info.get("title", "無法提取標題")
                thumbnail_url = info.get("thumbnail", "無法提取縮圖")

            return {
                "title": title,
                "thumbnail_url": thumbnail_url
            }
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
from deep_translator import GoogleTranslator

@text_audio_ns.route('/translate')
class Translate(Resource):
    @text_audio_ns.expect(translate_parser)
    def post(self):
        args = translate_parser.parse_args()
        text = args['text']
        target_language = args['target_language']

        try:
            # 分行翻譯
            lines = text.split("\n")
            translated_lines = [
                GoogleTranslator(source='auto', target=target_language).translate(line)
                for line in lines if line.strip()
            ]
            translated_text = "\n".join(translated_lines)
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

from pydub import AudioSegment
import os
import speech_recognition as sr

@text_audio_ns.route('/speech_to_text')
class SpeechToText(Resource):
    @text_audio_ns.expect(speech_parser)
    def post(self):
        args = speech_parser.parse_args()
        audio_path = args['audio']
        
        try:
            # 檢查格式並轉換為 WAV（如果需要）
            if not audio_path.endswith(".wav"):
                audio = AudioSegment.from_file(audio_path)
                wav_path = os.path.splitext(audio_path)[0] + ".wav"
                audio.export(wav_path, format="wav")
                audio_path = wav_path
            
            # 處理音訊
            recognizer = sr.Recognizer()
            with sr.AudioFile(audio_path) as source:
                audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data)
            return {"text": text}
        except Exception as e:
            return {"error": str(e)}, 500

@openAI_ns.route('/summarize')
class Summarize(Resource):
    @openAI_ns.expect(summarize_parser)
    def post(self):
        '''取得影片大綱'''
        args = summarize_parser.parse_args()
        subtitle = args['text']
        
        try:
            # 組裝 Prompt
            prompt_message = (
                "以下是一段影片字幕，請首先判斷這段字幕所使用的語言，"
                "然後使用相同語言將字幕內容整理成清晰、條理分明的影片大綱：\n\n"
                f"{subtitle}\n\n"
                "請以以下格式輸出：\n"
                "字幕語言：<判斷的語言>\n"
                "影片大綱：<以判斷語言整理的大綱>"
            )

            # 發送 OpenAI 請求
            client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "你是專門整理大綱的助手，請將文字整理成簡單易讀的大綱格式。"},
                    {"role": "user", "content": prompt_message}
                ],
            )
            response_str = str(response)
            content_start = response_str.find("影片大綱：") + len("影片大綱：")
            content_end = response_str.find("',", content_start)
            content = response_str[content_start:content_end]
            content_cleaned = content.replace("\\n", "\n").replace("\\", "").strip()
            
            print(content_cleaned)
            return content_cleaned

        except Exception as e:
            return {"error": str(e)}, 500

# 加入 namespaces 到主 API
api.add_namespace(youtube_ns, path='/youtube')
api.add_namespace(video_audio_ns, path='/video_audio')
api.add_namespace(text_audio_ns, path='/text_audio')
api.add_namespace(openAI_ns, path='/openai')

if __name__ == "__main__":
    app.run(debug=True, port=5003)

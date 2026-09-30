from typing import Optional, Dict
from app.core.config import settings

class TTSService:
    """
    Text-to-Speech service abstraction supporting Twilio/Exotel TwiML generation,
    Bhashini / Sarvam TTS voice synthesis, and Web Speech Synthesis prompts.
    """
    def __init__(self):
        self.api_key = settings.TTS_API_KEY
        
    def generate_twiml_speech(self, text: str, language: str = "ta") -> str:
        """
        Generates standard TwiML XML speech block with proper language code.
        """
        lang_code_map = {
            "ta": "ta-IN",
            "hi": "hi-IN",
            "en": "en-IN"
        }
        voice_lang = lang_code_map.get(language, "ta-IN")
        
        twiml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Aditi" language="{voice_lang}">{text}</Say>
    <Gather input="speech dtmf" timeout="5" speechTimeout="auto" action="/api/v1/voice/input?lang={language}" method="POST">
    </Gather>
</Response>"""
        return twiml.strip()

    def get_speech_audio_url(self, text: str, language: str = "ta") -> Optional[str]:
        """
        Returns audio stream URL or synthetic audio path for the text.
        """
        # Could point to generated MP3 or Web Speech synthesis trigger
        return None

tts_service = TTSService()

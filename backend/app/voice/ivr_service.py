from typing import Dict, Any
from app.ai.tts_service import tts_service
from app.voice.mock_provider import mock_voice_provider

class IVRService:
    """
    Manages telephony sessions conforming to Twilio / Exotel webhooks.
    Outputs TwiML XML responses or structured JSON for web/mobile simulation.
    """

    def handle_incoming_call(self, call_sid: str, caller_phone: str) -> str:
        """
        Entry webhook for inbound phone call.
        Plays multi-lingual language prompt.
        """
        result = mock_voice_provider.start_call(caller_phone=caller_phone)
        return tts_service.generate_twiml_speech(result["voice_prompt"], language="ta")

    def handle_input(self, call_sid: str, digits: str = "", speech_result: str = "", lang: str = "ta") -> str:
        """
        Processes speech or DTMF from telephony provider.
        """
        user_input = speech_result if speech_result else digits
        turn_result = mock_voice_provider.process_turn(call_sid, user_input)
        return tts_service.generate_twiml_speech(turn_result["voice_prompt"], language=turn_result.get("language", "ta"))

ivr_service = IVRService()

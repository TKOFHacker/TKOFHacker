from typing import Dict, Any, Optional
import uuid
from datetime import datetime, timezone
from app.ai.llm_service import llm_service
from app.ai.stt_service import stt_service

class MockVoiceProvider:
    """
    Local Voice/IVR Engine simulating carrier webhooks (Twilio/Exotel)
    Enables fully functional test calls, keypad inputs, and voice conversations
    directly through the browser or HTTP APIs without paid telecom accounts.
    """
    
    def __init__(self):
        # In-memory session cache: call_sid -> session_data
        self.active_sessions: Dict[str, Dict[str, Any]] = {}

    def start_call(self, caller_phone: str = "+919876543210", language: str = "ta") -> Dict[str, Any]:
        call_sid = f"CALL-{uuid.uuid4().hex[:12].upper()}"
        session_data = {
            "call_sid": call_sid,
            "caller_phone": caller_phone,
            "language": language,
            "state": "lang_select",
            "turn_count": 0,
            "history": [],
            "extracted_profile": {},
            "started_at": datetime.now(timezone.utc).isoformat()
        }
        self.active_sessions[call_sid] = session_data
        
        # Initial greeting prompt
        welcome_prompt = (
            "வணக்கம்! உங்கள் வாழ்வாதார செயற்கை நுண்ணறிவு உதவியாளர். "
            "தமிழுக்கு 1ஐ அழுத்தவும். For English press 2. हिंदी के लिए 3 दबाएं."
        )
        return {
            "call_sid": call_sid,
            "state": "lang_select",
            "voice_prompt": welcome_prompt,
            "options": ["1: தமிழ் (Tamil)", "2: English", "3: हिंदी (Hindi)"],
            "session": session_data
        }

    def process_turn(self, call_sid: str, user_input: str, input_type: str = "speech") -> Dict[str, Any]:
        session = self.active_sessions.get(call_sid)
        if not session:
            # Recreate session if expired
            self.start_call()
            session = self.active_sessions.get(call_sid, {
                "call_sid": call_sid, "caller_phone": "+919876543210", "language": "ta",
                "state": "ask_name", "turn_count": 1, "history": [], "extracted_profile": {}
            })
            self.active_sessions[call_sid] = session

        state = session["state"]
        lang = session["language"]
        session["turn_count"] += 1
        session["history"].append({"sender": "user", "text": user_input, "state": state})

        next_state = state
        next_prompt = ""
        is_completed = False

        if state == "lang_select":
            if "1" in user_input or "tamil" in user_input.lower():
                session["language"] = "ta"
                lang = "ta"
                next_prompt = "நன்றி! உங்கள் முழு பெயர் மற்றும் நீங்கள் வசிக்கும் ஊர் என்ன?"
            elif "3" in user_input or "hindi" in user_input.lower():
                session["language"] = "hi"
                lang = "hi"
                next_prompt = "धन्यवाद! आपका पूरा नाम और आप किस जिले से हैं?"
            else:
                session["language"] = "en"
                lang = "en"
                next_prompt = "Thank you! What is your full name and your home district?"
            next_state = "ask_name"

        elif state == "ask_name":
            session["extracted_profile"]["name"] = user_input.replace("My name is", "").replace("என் பெயர்", "").strip()
            if lang == "ta":
                next_prompt = "மகிழ்ச்சி! உங்கள் கல்வித் தகுதி என்ன? (எ.கா: 10வது, 12வது, ஐடிஐ, அல்லது பட்டப்படிப்பு?)"
            elif lang == "hi":
                next_prompt = "बहुत अच्छा! आपकी शिक्षा का स्तर क्या है? (जैसे 10वीं, 12वीं, आईटीआई या डिग्री)"
            else:
                next_prompt = "Great! What is your highest education level? (e.g., 10th, 12th, ITI, or Graduate?)"
            next_state = "ask_education"

        elif state == "ask_education":
            session["extracted_profile"]["education"] = user_input
            if lang == "ta":
                next_prompt = "தற்போது நீங்கள் என்ன வேலை செய்கிறீர்கள்? எத்தனை வருட அனுபவம் உள்ளது?"
            elif lang == "hi":
                next_prompt = "वर्तमान में आप क्या काम करते हैं और कितने वर्षों का अनुभव है?"
            else:
                next_prompt = "What is your current occupation and how many years of work experience do you have?"
            next_state = "ask_occupation"

        elif state == "ask_occupation":
            session["extracted_profile"]["occupation"] = user_input
            if lang == "ta":
                next_prompt = "உங்களுக்கு என்னென்ன வேலைகள் அல்லது திறன்கள் தெரியும்? (உதாரணத்திற்கு மின்சார வேலை, விவசாயம், ஓட்டுநர் போன்றவை)"
            elif lang == "hi":
                next_prompt = "आपको कौन-कौन से कौशल या काम आते हैं? (जैसे बिजली वायरिंग, खेती, ड्राइविंग)"
            else:
                next_prompt = "What practical skills do you have? (e.g., electrical wiring, farming, driving, plumbing)"
            next_state = "ask_skills"

        elif state == "ask_skills":
            session["extracted_profile"]["skills"] = [user_input]
            if lang == "ta":
                next_prompt = "எதிர்காலத்தில் நீங்கள் என்ன தொழில் செய்ய விரும்புகிறீர்கள்? சொந்த தொழில் தொடங்க விருப்பமா அல்லது நிறுவன வேலையா?"
            elif lang == "hi":
                next_prompt = "आप भविष्य में क्या काम करना चाहते हैं? खुद का व्यवसाय या किसी कंपनी में नौकरी?"
            else:
                next_prompt = "What career or livelihood do you aspire to pursue? Are you interested in self-employment?"
            next_state = "ask_interests"

        elif state == "ask_interests":
            session["extracted_profile"]["interests"] = [user_input]
            # Run AI extraction
            extracted = llm_service.extract_profile_from_conversation(session["history"], language=lang)
            session["extracted_profile"] = extracted
            
            if lang == "ta":
                next_prompt = (
                    f"அருமை {extracted.get('name', 'நண்பரே')}! உங்கள் விவரங்கள் வெற்றிகரமாக பதிவு செய்யப்பட்டன. "
                    "உங்களுக்கு தஞ்சாவூர் PMKK மையத்தில் இலவச எலக்ட்ரீசியன் பயிற்சி மற்றும் மாதம் ₹1,500 உதவித்தொகை பரிந்துரைக்கப்பட்டுள்ளது. "
                    "மேலும் PMEGP மூலம் 35% மானிய கடன் பெறலாம். முழு விவரங்கள் உங்கள் மொபைலுக்கு SMS செய்யப்பட்டுள்ளது. நன்றி!"
                )
            elif lang == "hi":
                next_prompt = (
                    f"बहुत बढ़िया {extracted.get('name', 'जी')}! आपका विवरण दर्ज हो गया है। "
                    "आपके लिए निशुल्क इलेक्ट्रीशियन प्रशिक्षण और PMEGP 35% सब्सिडी लोन की सिफारिश की गई है। "
                    "पूरी जानकारी आपके मोबाइल पर एसएमएस कर दी गई है। धन्यवाद!"
                )
            else:
                next_prompt = (
                    f"Splendid {extracted.get('name', 'Friend')}! Your profile has been generated. "
                    "You are recommended for the NSDC Level 4 Electrician Training in Thanjavur with ₹1,500 stipend "
                    "and PMEGP 35% subsidy scheme for your self-employment. An SMS with link has been sent. Thank you!"
                )
            next_state = "completed"
            is_completed = True

        else: # Completed farewell
            if lang == "ta":
                next_prompt = "அழைப்பு நிறைவடைந்தது. நன்றி, நல்வாழ்த்துகள்!"
            elif lang == "hi":
                next_prompt = "कॉल समाप्त हो गई है। धन्यवाद!"
            else:
                next_prompt = "Call completed. Best wishes for your livelihood journey!"
            is_completed = True

        session["state"] = next_state
        session["history"].append({"sender": "ai", "text": next_prompt, "state": next_state})

        return {
            "call_sid": call_sid,
            "state": next_state,
            "voice_prompt": next_prompt,
            "is_completed": is_completed,
            "language": lang,
            "extracted_profile": session["extracted_profile"],
            "session": session
        }

mock_voice_provider = MockVoiceProvider()

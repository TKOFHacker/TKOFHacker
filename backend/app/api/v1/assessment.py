from typing import Dict, Any, List
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import (
    Assessment, AssessmentMessage, Beneficiary, BeneficiaryProfile,
    BeneficiarySkill, SkillGap, LivelihoodRoadmap, RoadmapStep
)
from app.schemas.schemas import ApiResponse, AssessmentStartRequest, AssessmentMessageSend, AssessmentDetailRead
from app.ai.llm_service import llm_service
from app.ai.stt_service import stt_service
from app.api.deps import get_current_user
import re, random

router = APIRouter(prefix="/assessment", tags=["Assessment"])

# ──────────────────────────────────────────────────────────────
# CONVERSATIONAL AI ENGINE — human-like, empathetic, adaptive
# ──────────────────────────────────────────────────────────────

# Required profile fields we need to collect
REQUIRED_FIELDS = ["name", "location", "education", "occupation", "experience", "skills", "interests"]

# Warm opening greetings (randomized for variety)
GREETINGS = {
    "ta": [
        "வணக்கம்! 😊 நான் Livora — உங்கள் AI வாழ்வாதார வழிகாட்டி. உங்களுக்கு மிகவும் பொருத்தமான வேலை வாய்ப்புகளையும் பயிற்சிகளையும் கண்டறிய உதவுவேன். முதலில் உங்களைப் பற்றி கொஞ்சம் தெரிந்துகொள்ள விரும்புகிறேன் — உங்கள் பெயர் என்ன, எந்த ஊரைச் சேர்ந்தவர்?",
        "வணக்கம்! 🙏 Livora இங்கே. உங்கள் திறமைகளுக்கு ஏற்ற சிறந்த வாய்ப்புகளை கண்டறிய நான் இருக்கிறேன். நம் உரையாடலை தொடங்குவோம் — உங்கள் பெயரும் ஊரும் சொல்லுங்கள்!",
    ],
    "hi": [
        "नमस्ते! 😊 मैं Livora हूँ — आपका AI आजीविका सहायक। मैं आपकी क्षमताओं के अनुसार सबसे अच्छे अवसर और प्रशिक्षण खोजने में मदद करूँगा। पहले आपके बारे में थोड़ा जानना चाहूँगा — आपका नाम क्या है और कहाँ रहते हैं?",
        "नमस्ते! 🙏 Livora यहाँ है। आइए बातचीत शुरू करें — सबसे पहले, अपना नाम और जिला बताइए!",
    ],
    "en": [
        "Hello! 😊 I'm Livora — your AI Livelihood Assistant. I'm here to understand your skills and connect you with the best opportunities. Let's start with a friendly chat — what's your name, and where are you from?",
        "Hi there! 🙏 Welcome to Livora. I'd love to learn about you so I can find the perfect career path, training, and opportunities for you. To start — may I know your name and which district or city you're from?",
    ]
}

def _analyze_collected_info(messages: list) -> Dict[str, Any]:
    """Analyze conversation history to determine what profile info we already have."""
    user_texts = " ".join([m["text"] for m in messages if m["sender"] == "user"]).lower()
    
    collected = {}
    
    # Name detection
    name_match = re.search(r"(?:name is|my name|i am|i'm|பெயர்|நான்|नाम|मेरा नाम)\s+([A-Za-z\u0B80-\u0BFF\u0900-\u097F]+)", user_texts, re.IGNORECASE)
    if name_match:
        collected["name"] = name_match.group(1).title()
    # Also check for standalone names at start
    if not collected.get("name"):
        first_user = [m["text"] for m in messages if m["sender"] == "user"]
        if first_user:
            words = first_user[0].strip().split()
            if len(words) >= 1 and len(words) <= 4:
                # Likely a name response
                name_candidate = words[0].strip(",.")
                if len(name_candidate) > 1 and name_candidate.isalpha():
                    collected["name"] = name_candidate.title()

    # Location detection
    districts = ["thanjavur", "chennai", "coimbatore", "madurai", "salem", "trichy", 
                 "tiruchirappalli", "kanchipuram", "tirunelveli", "erode", "vellore",
                 "தஞ்சாவூர்", "சென்னை", "கோவை", "மதுரை", "तंजावुर", "चेन्नई"]
    for dist in districts:
        if dist in user_texts:
            collected["location"] = dist.title()
            break

    # Education detection
    edu_patterns = ["10th", "12th", "8th", "iti", "diploma", "graduate", "degree", "bcom", "ba", "bsc",
                    "10வது", "12வது", "பட்டம்", "10वीं", "12वीं", "स्नातक"]
    for edu in edu_patterns:
        if edu in user_texts:
            collected["education"] = edu.upper() if len(edu) <= 4 else edu.title()
            break

    # Occupation detection
    occupations = {
        "farmer": ["farmer", "farming", "agriculture", "விவசாயம்", "விவசாயி", "खेती", "किसान"],
        "electrician": ["electrician", "electrical", "wiring", "மின்சார", "எலக்ட்ரீசியன்", "बिजली"],
        "driver": ["driver", "driving", "ஓட்டுநர்", "ड्राइवर"],
        "carpenter": ["carpenter", "carpentry", "மர வேலை", "बढ़ई"],
        "tailor": ["tailor", "tailoring", "தையல்", "दर्जी"],
        "plumber": ["plumber", "plumbing", "குழாய்", "प्लंबर"],
        "welder": ["welder", "welding", "வெல்டிங்"],
        "construction": ["construction", "mason", "கட்டடம்", "मजदूर"],
        "shopkeeper": ["shop", "store", "கடை", "दुकान"],
        "daily wage": ["daily wage", "coolie", "கூலி", "मजदूरी"],
    }
    for occ_name, keywords in occupations.items():
        if any(kw in user_texts for kw in keywords):
            collected["occupation"] = occ_name.title()
            break

    # Experience detection
    exp_match = re.search(r"(\d+)\s*(?:years?|வருடம்|வருடங்கள்|साल|सालों|yrs)", user_texts, re.IGNORECASE)
    if exp_match:
        collected["experience"] = int(exp_match.group(1))

    # Skills detection
    skill_keywords = {
        "Basic Electrical": ["electrical", "wiring", "circuit", "மின்சார", "मिस्त्री", "बिजली"],
        "Farming": ["farming", "agriculture", "crop", "விவசாயம்", "खेती"],
        "Carpentry": ["carpentry", "wood", "மர வேலை"],
        "Plumbing": ["plumbing", "pipe", "குழாய்"],
        "Welding": ["welding", "வெல்டிங்"],
        "Driving": ["driving", "driver", "ஓட்டுநர்", "ड्राइवर"],
        "Tailoring": ["tailoring", "sewing", "தையல்"],
        "Computer": ["computer", "mobile repair", "கணினி"],
        "Cooking": ["cooking", "food", "சமையல்", "खाना"],
        "Solar Installation": ["solar", "panel", "சூரிய ஒளி"],
    }
    detected_skills = []
    for skill_name, aliases in skill_keywords.items():
        if any(alias in user_texts for alias in aliases):
            detected_skills.append(skill_name)
    if detected_skills:
        collected["skills"] = detected_skills

    # Interest / target career detection
    interest_keywords = {
        "Electrician": ["electrician", "electrical shop", "மின்சார", "எலக்ட்ரீசியன்", "इलेक्ट्रीशियन"],
        "Solar Technician": ["solar", "renewable", "சூரிய ஒளி", "सोलर"],
        "Self Employment": ["own shop", "own business", "சொந்தமாக", "self employ", "अपना काम", "खुद का"],
        "Plumber": ["plumber", "plumbing"],
        "Driver": ["driver", "driving"],
        "Mechanic": ["mechanic", "repair", "வாகன பழுது"],
    }
    detected_interests = []
    for interest_name, aliases in interest_keywords.items():
        if any(alias in user_texts for alias in aliases):
            detected_interests.append(interest_name)
    if detected_interests:
        collected["interests"] = detected_interests

    return collected


def _generate_conversational_reply(collected: Dict, language: str, turn_count: int) -> tuple:
    """Generate a warm, human-like conversational reply based on what's still missing."""
    
    missing = [f for f in REQUIRED_FIELDS if f not in collected]
    
    # If we have enough info (at least 4-5 fields), we can complete
    if len(missing) <= 2 and turn_count >= 3:
        return _generate_summary_reply(collected, language), True
    
    # Build natural follow-up based on what's missing
    name = collected.get("name", "")
    name_greeting = f" {name}" if name else ""
    
    # Conversational responses that feel human
    responses = {
        "ta": [],
        "hi": [],
        "en": []
    }
    
    if "name" not in collected and "location" not in collected:
        responses = {
            "ta": ["உங்கள் பெயர் மற்றும் எந்த மாவட்டத்தில் வசிக்கிறீர்கள் என்று சொல்லுங்கள் 😊"],
            "hi": ["आपका नाम और कौन सा जिला — बताइए! 😊"],
            "en": ["Could you tell me your name and which district you're from? 😊"],
        }
    elif "education" not in collected:
        responses = {
            "ta": [
                f"நன்றி{name_greeting}! 👍 உங்கள் படிப்பு எந்த அளவு? 10வது, 12வது, ITI, அல்லது பட்டப்படிப்பு முடித்தீர்களா?",
                f"அருமை{name_greeting}! உங்கள் கல்வித் தகுதி பற்றி சொல்லுங்கள் — எத்தனையாவது வகுப்பு வரை படித்தீர்கள்?",
            ],
            "hi": [
                f"धन्यवाद{name_greeting}! 👍 आपकी पढ़ाई कितनी हुई है? 10वीं, 12वीं, ITI या ग्रेजुएट?",
                f"बढ़िया{name_greeting}! अपनी शिक्षा के बारे में बताइए — कितनी तक पढ़ाई की?",
            ],
            "en": [
                f"Thank you{name_greeting}! 👍 What's your education level? Like 10th, 12th, ITI, diploma, or graduate?",
                f"Great{name_greeting}! Tell me about your education — how far did you study?",
            ],
        }
    elif "occupation" not in collected and "skills" not in collected:
        responses = {
            "ta": [
                f"நல்லது{name_greeting}! இப்போது நீங்கள் என்ன வேலை செய்கிறீர்கள்? உங்களுக்கு என்ன வேலை தெரியும் — விவசாயம், மின்சார வேலை, ஓட்டுநர், அல்லது வேறு ஏதாவது?",
                f"புரிகிறது! தற்போது என்ன தொழில் செய்கிறீர்கள், எத்தனை வருடம் அனுபவம் உள்ளது என்று சொல்லுங்கள்.",
            ],
            "hi": [
                f"अच्छा{name_greeting}! अभी आप क्या काम करते हैं? आपको कौन से काम आते हैं — खेती, बिजली, ड्राइविंग, या कोई और?",
                f"समझ गया! अपना मौजूदा काम और अनुभव बताइए — कितने सालों से कर रहे हैं?",
            ],
            "en": [
                f"Got it{name_greeting}! What do you currently do for work? And what practical skills do you have — farming, electrical, driving, carpentry, or anything else?",
                f"Wonderful! Tell me about your current job and what hands-on skills you've picked up over the years.",
            ],
        }
    elif "interests" not in collected:
        responses = {
            "ta": [
                f"மிகவும் நல்ல அனுபவம்{name_greeting}! 🌟 எதிர்காலத்தில் என்ன தொழில் செய்ய ஆசை? சொந்தமாக தொழில் தொடங்க விருப்பமா? உங்கள் கனவு வேலை பற்றி சொல்லுங்கள்!",
                f"அற்புதம்! நீங்கள் எந்த துறையில் முன்னேற விரும்புகிறீர்கள்? எலக்ட்ரீசியன், சோலார் தொழில்நுட்பம், சொந்த தொழில் — எதில் ஆர்வம்?",
            ],
            "hi": [
                f"बहुत अच्छा अनुभव{name_greeting}! 🌟 भविष्य में क्या करना चाहते हैं? अपना खुद का काम शुरू करना चाहते हैं? अपने सपने का काम बताइए!",
                f"शानदार! आप किस क्षेत्र में आगे बढ़ना चाहते हैं? इलेक्ट्रीशियन, सोलर, खुद का बिज़नेस — किसमें रुचि है?",
            ],
            "en": [
                f"That's impressive experience{name_greeting}! 🌟 What's your dream career? Would you like to start your own business? Tell me what you aspire to do!",
                f"Wonderful! What field do you want to grow in? Electrician, solar tech, your own enterprise — what excites you?",
            ],
        }
    else:
        # We have most things, ask a clarifying question or wrap up
        responses = {
            "ta": [
                f"நன்றி{name_greeting}! நீங்கள் கொடுத்த தகவல்களை வைத்து உங்கள் திறன் சுயவிவரத்தை உருவாக்குகிறேன். வேறு ஏதாவது சொல்ல விரும்புகிறீர்களா, அல்லது நான் உங்கள் வாழ்வாதார பாதையை தயாரிக்கட்டுமா?",
            ],
            "hi": [
                f"धन्यवाद{name_greeting}! आपकी जानकारी से आपका कौशल प्रोफ़ाइल बना रहा हूँ। कुछ और बताना चाहते हैं, या मैं आपका करियर मार्ग तैयार करूँ?",
            ],
            "en": [
                f"Thank you{name_greeting}! I'm building your skill profile from everything you've shared. Anything else you'd like to add, or shall I prepare your career roadmap?",
            ],
        }
    
    lang_responses = responses.get(language, responses["en"])
    reply = random.choice(lang_responses)
    
    return reply, False


def _generate_summary_reply(collected: Dict, language: str) -> str:
    """Generate a warm completion summary acknowledging what we learned."""
    name = collected.get("name", "")
    skills = ", ".join(collected.get("skills", ["your skills"]))
    interests = ", ".join(collected.get("interests", ["your interests"]))
    
    summaries = {
        "ta": f"அருமை {name}! 🎉 உங்கள் விவரங்களை நான் முழுமையாக புரிந்துகொண்டேன். உங்கள் திறமைகள் ({skills}) மிகவும் மதிப்புமிக்கவை! இப்போது உங்களுக்கான தனிப்பயன் திறன் பகுப்பாய்வு, பயிற்சி வாய்ப்புகள், மற்றும் வாழ்வாதார பாதையை உருவாக்குகிறேன்... ✨",
        "hi": f"बहुत बढ़िया {name}! 🎉 मैंने आपकी पूरी जानकारी समझ ली। आपके कौशल ({skills}) बहुत मूल्यवान हैं! अब मैं आपके लिए व्यक्तिगत कौशल विश्लेषण, प्रशिक्षण अवसर और आजीविका मार्ग तैयार कर रहा हूँ... ✨",
        "en": f"Wonderful, {name}! 🎉 I've understood your complete profile. Your skills in {skills} are really valuable! I'm now creating your personalized skill analysis, training opportunities, and career roadmap... ✨",
    }
    return summaries.get(language, summaries["en"])


@router.post("/start", response_model=ApiResponse[Dict[str, Any]])
def start_assessment(req: AssessmentStartRequest, db: Session = Depends(get_db)):
    beneficiary_id = req.beneficiary_id
    if not beneficiary_id:
        beneficiary = db.query(Beneficiary).first()
        beneficiary_id = beneficiary.id if beneficiary else 1
        
    assessment = Assessment(
        beneficiary_id=beneficiary_id,
        channel=req.channel,
        status="in_progress",
        current_step="conversation",
        language=req.language
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    
    # Pick a warm, randomized greeting
    lang_greetings = GREETINGS.get(req.language, GREETINGS["en"])
    welcome_text = random.choice(lang_greetings)
    
    ai_msg = AssessmentMessage(
        assessment_id=assessment.id,
        sender="ai",
        message_text=welcome_text,
        question_key="greeting"
    )
    db.add(ai_msg)
    db.commit()
    
    return ApiResponse(
        success=True,
        data={
            "assessment_id": assessment.id,
            "status": assessment.status,
            "current_step": "conversation",
            "language": req.language,
            "welcome_message": welcome_text
        },
        message="Assessment started"
    )

@router.post("/{id}/message", response_model=ApiResponse[Dict[str, Any]])
def send_message(id: int, msg_in: AssessmentMessageSend, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == id).first()
    if not assessment:
        return ApiResponse(success=False, message="Assessment not found", error={"code": "ASSESSMENT_NOT_FOUND"})
        
    user_text = msg_in.message_text
    
    # Save user message
    user_msg = AssessmentMessage(
        assessment_id=assessment.id,
        sender="user",
        message_text=user_text,
        question_key=msg_in.question_key or "conversation"
    )
    db.add(user_msg)
    db.commit()
    
    # Build full conversation history
    all_messages = db.query(AssessmentMessage).filter(
        AssessmentMessage.assessment_id == assessment.id
    ).order_by(AssessmentMessage.created_at).all()
    
    history = [{"sender": m.sender, "text": m.message_text} for m in all_messages]
    
    # Analyze what info we've collected so far
    collected = _analyze_collected_info(history)
    user_turn_count = len([m for m in history if m["sender"] == "user"])
    
    # Generate natural conversational reply
    ai_reply, is_complete = _generate_conversational_reply(collected, assessment.language, user_turn_count)
    
    if is_complete:
        # Save AI completion message
        ai_msg = AssessmentMessage(
            assessment_id=assessment.id,
            sender="ai",
            message_text=ai_reply,
            question_key="completing"
        )
        db.add(ai_msg)
        db.commit()
        
        # Trigger full assessment completion
        return complete_assessment(id=id, db=db)
    else:
        # Save AI reply and continue conversation
        ai_msg = AssessmentMessage(
            assessment_id=assessment.id,
            sender="ai",
            message_text=ai_reply,
            question_key="conversation"
        )
        db.add(ai_msg)
        db.commit()
        
        return ApiResponse(
            success=True,
            data={
                "assessment_id": assessment.id,
                "current_step": "conversation",
                "ai_reply": ai_reply,
                "is_completed": False,
                "collected_fields": list(collected.keys()),
                "progress": len(collected) / len(REQUIRED_FIELDS)
            },
            message="Message processed"
        )

@router.post("/{id}/audio", response_model=ApiResponse[Dict[str, Any]])
def handle_audio(id: int, audio_in: Dict[str, Any], db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == id).first()
    if not assessment:
        return ApiResponse(success=False, message="Assessment not found", error={"code": "ASSESSMENT_NOT_FOUND"})
        
    # Transcribe audio using STT service
    transcript = stt_service.transcribe_audio_chunk(
        language=assessment.language,
        hint_context=assessment.current_step
    )
    
    # Forward as regular message
    msg_send = AssessmentMessageSend(message_text=transcript, question_key="conversation")
    return send_message(id=id, msg_in=msg_send, db=db)

@router.post("/{id}/complete", response_model=ApiResponse[Dict[str, Any]])
def complete_assessment(id: int, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == id).first()
    if not assessment:
        return ApiResponse(success=False, message="Assessment not found", error={"code": "ASSESSMENT_NOT_FOUND"})
        
    messages = db.query(AssessmentMessage).filter(AssessmentMessage.assessment_id == assessment.id).all()
    history = [{"sender": m.sender, "text": m.message_text} for m in messages]
    
    # 1. AI Profile Extraction
    extracted_profile = llm_service.extract_profile_from_conversation(history, language=assessment.language)
    assessment.ai_extracted_json = extracted_profile
    assessment.status = "completed"
    assessment.current_step = "completed"
    assessment.completed_at = datetime.now(timezone.utc)
    
    beneficiary = db.query(Beneficiary).filter(Beneficiary.id == assessment.beneficiary_id).first()
    mapped_skills = []
    skill_gap_result = None
    
    if beneficiary:
        beneficiary.is_profile_completed = True
        if extracted_profile.get("location"):
            beneficiary.location_district = extracted_profile["location"].get("district", beneficiary.location_district)
            beneficiary.location_state = extracted_profile["location"].get("state", beneficiary.location_state)
            
        # Update or create BeneficiaryProfile
        profile = beneficiary.profile
        if not profile:
            profile = BeneficiaryProfile(beneficiary_id=beneficiary.id)
            db.add(profile)
            
        profile.education_level = extracted_profile.get("education", "12th")
        profile.current_occupation = extracted_profile.get("occupation", "Farmer")
        profile.years_experience = extracted_profile.get("experience_years", 3.0)
        profile.interests_json = extracted_profile.get("interests", ["Electrical work", "Self employment"])
        profile.target_career = extracted_profile.get("target_career", "Electrician")
        profile.extracted_profile_raw = extracted_profile
        
        # 2. AI Skill Mapping
        raw_skills = extracted_profile.get("skills", ["Farming", "Basic Electrical"])
        mapped_skills = llm_service.map_skills(raw_skills, experience_years=profile.years_experience)
        
        # Update Beneficiary Skills table
        db.query(BeneficiarySkill).filter(BeneficiarySkill.beneficiary_id == beneficiary.id).delete()
        for ms in mapped_skills:
            bs = BeneficiarySkill(
                beneficiary_id=beneficiary.id,
                skill_name=ms["skill_name"],
                skill_category=ms["skill_category"],
                skill_level=ms["skill_level"],
                years_experience=ms["years_experience"],
                ai_confidence=ms["ai_confidence"],
                verified_by_assessment=True
            )
            db.add(bs)
            
        # 3. AI Skill Gap Analysis
        skill_gap_result = llm_service.perform_skill_gap_analysis(raw_skills, target_career=profile.target_career)
        db.query(SkillGap).filter(SkillGap.beneficiary_id == beneficiary.id).delete()
        sg = SkillGap(
            beneficiary_id=beneficiary.id,
            target_career=profile.target_career,
            current_skills_json=skill_gap_result["current_skills"],
            missing_skills_json=skill_gap_result["missing_skills"],
            gap_score=skill_gap_result["gap_score"],
            recommended_training_ids_json=[t["id"] for t in skill_gap_result["required_training"]]
        )
        db.add(sg)
        
        # 4. Generate/Update Livelihood Roadmap
        roadmap_steps_data = llm_service.generate_livelihood_roadmap(
            goal_title=f"Become a certified {profile.target_career}",
            target_career=profile.target_career
        )
        existing_roadmap = db.query(LivelihoodRoadmap).filter(LivelihoodRoadmap.beneficiary_id == beneficiary.id).first()
        if not existing_roadmap:
            existing_roadmap = LivelihoodRoadmap(
                beneficiary_id=beneficiary.id,
                goal_title=f"Become a Certified {profile.target_career} & Start Independent Service",
                target_timeframe="6 Months",
                total_steps=len(roadmap_steps_data),
                completed_steps=1,
                status="active"
            )
            db.add(existing_roadmap)
            db.commit()
            db.refresh(existing_roadmap)
            
            for s in roadmap_steps_data:
                step_obj = RoadmapStep(
                    roadmap_id=existing_roadmap.id,
                    step_order=s["step_order"],
                    title=s["title"],
                    description=s["description"],
                    expected_duration=s["expected_duration"],
                    action_type=s["action_type"],
                    is_completed=s["is_completed"]
                )
                db.add(step_obj)

    db.commit()
    
    completion_text = {
        "ta": "உங்கள் விவரங்கள் வெற்றிகரமாக பகுப்பாய்வு செய்யப்பட்டன! 🎯 உங்கள் திறன் சுயவிவரம், இடைவெளி பகுப்பாய்வு மற்றும் தனிப்பயன் வாழ்வாதார பாதை தயாராக உள்ளது. இப்போது பார்க்கலாம்!",
        "hi": "आपका विश्लेषण पूरा हो गया! 🎯 आपका कौशल प्रोफ़ाइल, अंतराल विश्लेषण और व्यक्तिगत आजीविका रोडमैप तैयार है। अभी देखिए!",
        "en": "Your assessment is complete! 🎯 Your AI skill profile, gap analysis, and personalized livelihood roadmap are ready. Let's explore them!"
    }.get(assessment.language, "Assessment successfully completed.")
    
    # Final AI message
    ai_msg = AssessmentMessage(
        assessment_id=assessment.id,
        sender="ai",
        message_text=completion_text,
        question_key="completed"
    )
    db.add(ai_msg)
    db.commit()
    
    return ApiResponse(
        success=True,
        data={
            "assessment_id": assessment.id,
            "status": "completed",
            "extracted_profile": extracted_profile,
            "mapped_skills": mapped_skills if beneficiary else [],
            "skill_gap": skill_gap_result if beneficiary else None,
            "completion_message": completion_text,
            "is_completed": True
        },
        message="Assessment successfully finalized"
    )

@router.get("/{id}", response_model=ApiResponse[Dict[str, Any]])
def get_assessment(id: int, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == id).first()
    if not assessment:
        return ApiResponse(success=False, message="Assessment not found", error={"code": "ASSESSMENT_NOT_FOUND"})
        
    messages = [
        {
            "id": m.id,
            "sender": m.sender,
            "message_text": m.message_text,
            "question_key": m.question_key,
            "created_at": m.created_at.isoformat()
        }
        for m in assessment.messages
    ]
    
    return ApiResponse(
        success=True,
        data={
            "id": assessment.id,
            "beneficiary_id": assessment.beneficiary_id,
            "channel": assessment.channel,
            "status": assessment.status,
            "current_step": assessment.current_step,
            "language": assessment.language,
            "ai_extracted_json": assessment.ai_extracted_json,
            "messages": messages,
            "created_at": assessment.created_at.isoformat()
        },
        message="Assessment retrieved"
    )

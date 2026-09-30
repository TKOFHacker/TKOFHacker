import pytest
from app.ai.llm_service import llm_service
from app.voice.mock_provider import mock_voice_provider
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token

def test_password_hashing():
    pwd = "secretpassword"
    hashed = get_password_hash(pwd)
    assert verify_password(pwd, hashed) is True
    assert verify_password("wrongpassword", hashed) is False

def test_jwt_token_generation_and_decode():
    token = create_access_token(subject=1, role="beneficiary")
    payload = decode_token(token)
    assert payload is not None
    assert payload.get("sub") == "1"
    assert payload.get("role") == "beneficiary"

def test_llm_skill_mapping():
    skills = ["Basic Electrical", "Farming"]
    mapped = llm_service.map_skills(skills)
    assert len(mapped) == 2
    electrical = next(s for s in mapped if s["skill_name"] == "Basic Electrical")
    assert electrical["skill_level"] == "Intermediate"
    assert electrical["ai_confidence"] > 0.8

def test_skill_gap_analysis():
    current_skills = ["Basic Electrical"]
    gap = llm_service.perform_skill_gap_analysis(current_skills, target_career="Electrician")
    assert gap["target_career"] == "Electrician"
    assert "Electrical Safety" in gap["missing_skills"]
    assert len(gap["required_training"]) > 0

def test_livelihood_roadmap_generation():
    roadmap = llm_service.generate_livelihood_roadmap(target_career="Electrician")
    assert len(roadmap) == 6
    assert roadmap[0]["step_order"] == 1
    assert "Foundation" in roadmap[0]["title"]
    assert roadmap[5]["step_order"] == 6

def test_mock_voice_call_flow():
    start = mock_voice_provider.start_call(caller_phone="+919876543210", language="ta")
    assert start["state"] == "lang_select"
    assert "call_sid" in start
    
    # Select language 1 (Tamil)
    turn1 = mock_voice_provider.process_turn(start["call_sid"], "1")
    assert turn1["state"] == "ask_name"
    
    # State name
    turn2 = mock_voice_provider.process_turn(start["call_sid"], "Karthik")
    assert turn2["state"] == "ask_education"

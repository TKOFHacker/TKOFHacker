from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, Request, Response, Form
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import VoiceCall, VoiceSession, Beneficiary
from app.schemas.schemas import ApiResponse, IVRInputRequest
from app.voice.ivr_service import ivr_service
from app.voice.mock_provider import mock_voice_provider
from app.ai.tts_service import tts_service

router = APIRouter(prefix="/voice", tags=["Voice / IVR Telephony"])

@router.post("/incoming")
async def voice_incoming(
    request: Request,
    CallSid: Optional[str] = Form(None),
    From: Optional[str] = Form("+919876543210"),
    db: Session = Depends(get_db)
):
    """
    Twilio / Exotel Inbound Call Webhook.
    Returns TwiML XML or JSON based on Accept header.
    """
    call_sid = CallSid or "CALL-WEBHOOK-001"
    caller_phone = From or "+919876543210"
    
    # Log incoming call in DB
    existing_call = db.query(VoiceCall).filter(VoiceCall.call_sid == call_sid).first()
    if not existing_call:
        beneficiary = db.query(Beneficiary).first()
        new_call = VoiceCall(
            call_sid=call_sid,
            caller_phone=caller_phone,
            beneficiary_id=beneficiary.id if beneficiary else None,
            provider="TwilioWebhook",
            direction="inbound",
            status="in_progress"
        )
        db.add(new_call)
        db.commit()

    twiml_content = ivr_service.handle_incoming_call(call_sid, caller_phone)
    return Response(content=twiml_content, media_type="application/xml")

@router.post("/answer")
def voice_answer(payload: Dict[str, Any] = {}):
    call_sid = payload.get("call_sid", "CALL-WEB-ANSWER")
    caller_phone = payload.get("caller_phone", "+919876543210")
    result = mock_voice_provider.start_call(caller_phone=caller_phone)
    return ApiResponse(success=True, data=result, message="Call answered")

@router.post("/input")
async def voice_input(
    request: Request,
    CallSid: Optional[str] = Form(None),
    Digits: Optional[str] = Form(None),
    SpeechResult: Optional[str] = Form(None),
    lang: Optional[str] = "ta"
):
    """
    Twilio / Exotel User Input Webhook (Speech or DTMF).
    """
    call_sid = CallSid or "CALL-WEBHOOK-001"
    twiml_reply = ivr_service.handle_input(call_sid, digits=Digits or "", speech_result=SpeechResult or "", lang=lang or "ta")
    return Response(content=twiml_reply, media_type="application/xml")

@router.post("/simulate")
def simulate_voice_turn(req: IVRInputRequest, db: Session = Depends(get_db)):
    """
    Interactive endpoint for frontend phone dialer / IVR simulator.
    """
    if not req.call_sid or req.call_sid == "start":
        start_data = mock_voice_provider.start_call(caller_phone="+919876543210", language=req.language or "ta")
        # Save to DB
        beneficiary = db.query(Beneficiary).first()
        call_obj = VoiceCall(
            call_sid=start_data["call_sid"],
            caller_phone="+919876543210",
            beneficiary_id=beneficiary.id if beneficiary else 1,
            provider="MockVoiceProvider",
            direction="inbound",
            status="in_progress",
            language=req.language or "ta"
        )
        db.add(call_obj)
        db.commit()
        return ApiResponse(success=True, data=start_data, message="Simulated call started")

    result = mock_voice_provider.process_turn(req.call_sid, req.user_input, input_type=req.input_type)
    
    # If completed, update call record
    if result.get("is_completed"):
        call_record = db.query(VoiceCall).filter(VoiceCall.call_sid == req.call_sid).first()
        if call_record:
            call_record.status = "completed"
            call_record.transcript_summary = f"Voice assessment completed for {result.get('extracted_profile', {}).get('name', 'Caller')}. Matched for Electrician and PMEGP."
            db.commit()

    return ApiResponse(success=True, data=result, message="Turn processed")

@router.post("/callback")
def voice_callback(payload: Dict[str, Any] = {}):
    return ApiResponse(success=True, data={"status": "received"}, message="Carrier callback processed")

@router.post("/end")
def voice_end(payload: Dict[str, Any] = {}, db: Session = Depends(get_db)):
    call_sid = payload.get("call_sid")
    if call_sid:
        call = db.query(VoiceCall).filter(VoiceCall.call_sid == call_sid).first()
        if call:
            call.status = "completed"
            db.commit()
    return ApiResponse(success=True, data={"status": "ended"}, message="Call ended")

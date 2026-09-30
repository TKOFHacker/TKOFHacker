from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, UserRole, Beneficiary, BeneficiaryProfile
from app.schemas.schemas import ApiResponse, UserLogin, UserRegister, TokenResponse, UserProfileRead
from app.core.security import verify_password, get_password_hash, create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=ApiResponse[TokenResponse])
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.phone == user_in.phone) | (User.email == user_in.email)).first()
    if existing:
        return ApiResponse(
            success=False,
            message="User with this phone number or email already exists",
            error={"code": "USER_ALREADY_EXISTS"}
        )
    
    role_enum = UserRole.BENEFICIARY
    if user_in.role == "admin":
        role_enum = UserRole.ADMIN
    elif user_in.role == "employer":
        role_enum = UserRole.EMPLOYER
        
    new_user = User(
        phone=user_in.phone,
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        role=role_enum,
        preferred_language=user_in.preferred_language
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Auto-create beneficiary profile if role is beneficiary
    beneficiary_id = None
    if role_enum == UserRole.BENEFICIARY:
        beneficiary = Beneficiary(
            user_id=new_user.id,
            phone_masked=f"{user_in.phone[:4]}XXXX{user_in.phone[-2:]}" if len(user_in.phone) >= 10 else user_in.phone,
            location_district=user_in.district or "Thanjavur",
            location_state=user_in.state or "Tamil Nadu"
        )
        db.add(beneficiary)
        db.commit()
        db.refresh(beneficiary)
        beneficiary_id = beneficiary.id
        
        profile = BeneficiaryProfile(
            beneficiary_id=beneficiary.id,
            education_level="12th",
            current_occupation="Farmer",
            target_career="Electrician"
        )
        db.add(profile)
        db.commit()

    token = create_access_token(new_user.id, role=new_user.role.value)
    user_data = {
        "id": new_user.id,
        "full_name": new_user.full_name,
        "phone": new_user.phone,
        "role": new_user.role.value,
        "preferred_language": new_user.preferred_language,
        "beneficiary_id": beneficiary_id
    }
    
    return ApiResponse(
        success=True,
        data={"access_token": token, "token_type": "bearer", "user": user_data},
        message="Registration successful"
    )

@router.post("/login", response_model=ApiResponse[TokenResponse])
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == login_data.phone).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        return ApiResponse(
            success=False,
            message="Invalid phone number or password",
            error={"code": "INVALID_CREDENTIALS"}
        )
        
    beneficiary_id = user.beneficiary.id if user.beneficiary else None
    token = create_access_token(user.id, role=user.role.value)
    
    user_data = {
        "id": user.id,
        "full_name": user.full_name,
        "phone": user.phone,
        "email": user.email,
        "role": user.role.value,
        "preferred_language": user.preferred_language,
        "beneficiary_id": beneficiary_id
    }
    
    return ApiResponse(
        success=True,
        data={"access_token": token, "token_type": "bearer", "user": user_data},
        message="Login successful"
    )

@router.post("/refresh", response_model=ApiResponse[Dict[str, Any]])
def refresh(current_user: User = Depends(get_current_user)):
    token = create_access_token(current_user.id, role=current_user.role.value)
    return ApiResponse(
        success=True,
        data={"access_token": token, "token_type": "bearer"},
        message="Token refreshed"
    )

@router.get("/me", response_model=ApiResponse[UserProfileRead])
def get_me(current_user: User = Depends(get_current_user)):
    beneficiary = current_user.beneficiary
    return ApiResponse(
        success=True,
        data={
            "id": current_user.id,
            "full_name": current_user.full_name,
            "phone": current_user.phone,
            "phone_masked": beneficiary.phone_masked if beneficiary else current_user.phone,
            "email": current_user.email,
            "role": current_user.role.value,
            "preferred_language": current_user.preferred_language,
            "beneficiary_id": beneficiary.id if beneficiary else None,
            "district": beneficiary.location_district if beneficiary else "Thanjavur",
            "state": beneficiary.location_state if beneficiary else "Tamil Nadu",
            "is_profile_completed": beneficiary.is_profile_completed if beneficiary else False
        },
        message="User profile fetched"
    )

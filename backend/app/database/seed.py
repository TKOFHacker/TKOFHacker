from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.models import (
    User, UserRole, Beneficiary, BeneficiaryProfile, BeneficiarySkill,
    Education, Occupation, Skill, Job, JobSkill, TrainingProgram, TrainingSkill,
    GovernmentScheme, SelfEmploymentIdea, LivelihoodRoadmap, RoadmapStep,
    VoiceCall, VoiceSession, Notification, SkillGap, Assessment, AssessmentMessage
)

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).filter(User.phone == "9876543210").first():
        return

    print("Seeding database with demo data...")
    now = datetime.now(timezone.utc)

    # 1. Users
    # Beneficiary: Karthik
    user_arun = User(
        phone="9876543210",
        email="karthik@demo.com",
        full_name="Karthik M.",
        hashed_password=get_password_hash("password123"),
        role=UserRole.BENEFICIARY,
        preferred_language="ta"
    )
    # Admin: Government Officer
    user_admin = User(
        phone="9876543211",
        email="admin@demo.com",
        full_name="Officer Rajesh Kumar (District Collectorate)",
        hashed_password=get_password_hash("password123"),
        role=UserRole.ADMIN,
        preferred_language="en"
    )
    # Employer: Skill Provider / Contractor
    user_employer = User(
        phone="9876543212",
        email="employer@demo.com",
        full_name="Kavitha Energy & Electrical Solutions",
        hashed_password=get_password_hash("password123"),
        role=UserRole.EMPLOYER,
        preferred_language="en"
    )
    db.add_all([user_arun, user_admin, user_employer])
    db.commit()

    # 2. Beneficiary Arun
    arun_beneficiary = Beneficiary(
        user_id=user_arun.id,
        aadhaar_masked="XXXX-XXXX-8921",
        age=24,
        gender="Male",
        phone_masked="98765XXXX0",
        location_state="Tamil Nadu",
        location_district="Thanjavur",
        location_village="Kumbakonam Rural",
        pincode="612001",
        is_profile_completed=True
    )
    db.add(arun_beneficiary)
    db.commit()

    # 3. Beneficiary Profile
    arun_profile = BeneficiaryProfile(
        beneficiary_id=arun_beneficiary.id,
        education_level="12th",
        education_detail="Higher Secondary School Certificate (State Board)",
        current_occupation="Farmer",
        years_experience=3.0,
        current_income_range="₹8,000 - ₹12,000 / month",
        target_career="Electrician",
        interests_json=["Electrical work", "Self employment", "Solar installation"],
        entrepreneurship_interest=True,
        training_interest=True,
        device_type="Feature Phone / Web",
        extracted_profile_raw={
            "name": "Karthik M.",
            "education": "12th",
            "occupation": "Farmer",
            "experience_years": 3,
            "skills": ["Farming", "Basic Electrical"],
            "interests": ["Electrical work", "Self employment"],
            "location": {"state": "Tamil Nadu", "district": "Thanjavur"},
            "language": "ta"
        }
    )
    db.add(arun_profile)

    # 4. Beneficiary Skills
    skill_1 = BeneficiarySkill(
        beneficiary_id=arun_beneficiary.id,
        skill_name="Basic Electrical",
        skill_category="Technical",
        skill_level="Intermediate",
        years_experience=2.5,
        ai_confidence=0.87,
        verified_by_assessment=True
    )
    skill_2 = BeneficiarySkill(
        beneficiary_id=arun_beneficiary.id,
        skill_name="Farming",
        skill_category="Agriculture",
        skill_level="Advanced",
        years_experience=3.0,
        ai_confidence=0.94,
        verified_by_assessment=True
    )
    db.add_all([skill_1, skill_2])

    # 5. Skill Gap
    skill_gap = SkillGap(
        beneficiary_id=arun_beneficiary.id,
        target_career="Electrician",
        current_skills_json=["Basic Electrical", "Farming"],
        missing_skills_json=["Electrical Safety", "Advanced Wiring", "Certification"],
        gap_score=35.0,
        recommended_training_ids_json=[1, 2]
    )
    db.add(skill_gap)

    # 6. Livelihood Roadmap (6 Steps)
    roadmap = LivelihoodRoadmap(
        beneficiary_id=arun_beneficiary.id,
        goal_title="Become a Certified Electrician & Start Independent Service",
        target_timeframe="6 Months",
        total_steps=6,
        completed_steps=1,
        status="active"
    )
    db.add(roadmap)
    db.commit()

    steps = [
        RoadmapStep(
            roadmap_id=roadmap.id,
            step_order=1,
            title="Complete Foundation Course",
            description="NSDC Level 3 Domestic Electrical Basics at PMKK Thanjavur (Free Govt. training with ₹1,500 stipend).",
            expected_duration="4 Weeks",
            action_type="training",
            is_completed=True,
            completed_at=now - timedelta(days=5)
        ),
        RoadmapStep(
            roadmap_id=roadmap.id,
            step_order=2,
            title="Complete Advanced Training",
            description="Master 3-Phase Industrial Wiring, Solar Inverter Integration, and Circuit Breaker Diagnostics.",
            expected_duration="8 Weeks",
            action_type="training",
            is_completed=False
        ),
        RoadmapStep(
            roadmap_id=roadmap.id,
            step_order=3,
            title="Obtain Certification",
            description="Clear the NSQF Level 4 Electrician Assessment and get your Digital Skill Certificate.",
            expected_duration="2 Weeks",
            action_type="certification",
            is_completed=False
        ),
        RoadmapStep(
            roadmap_id=roadmap.id,
            step_order=4,
            title="Apply for Local Jobs",
            description="Connect with vetted electrical contractor openings in Thanjavur & Trichy (₹16,000 - ₹22,000/mo).",
            expected_duration="4 Weeks",
            action_type="job_application",
            is_completed=False
        ),
        RoadmapStep(
            roadmap_id=roadmap.id,
            step_order=5,
            title="Gain Experience",
            description="Complete 6 months of supervised field experience servicing commercial buildings and pump sets.",
            expected_duration="6 Months",
            action_type="job_application",
            is_completed=False
        ),
        RoadmapStep(
            roadmap_id=roadmap.id,
            step_order=6,
            title="Start Independent Service",
            description="Avail PMEGP 35% Govt. Subsidy Loan (₹2 Lakhs) for mobile service kit and launch independent electrical enterprise.",
            expected_duration="Ongoing",
            action_type="business_launch",
            is_completed=False
        )
    ]
    db.add_all(steps)

    # 7. Training Programs
    t1 = TrainingProgram(
        title="NSDC Level 4 Domestic & Commercial Electrician",
        provider_name="Pradhan Mantri Kaushal Kendra (PMKK) Thanjavur",
        sector="Electrical & Electronics",
        duration="3 Months (360 Hours)",
        mode="Hybrid (Practical Hands-on)",
        cost="Free (Govt. Sponsored under PMKVY 4.0)",
        location="Thanjavur Skill Hub, Medical College Road",
        certification="NSQF Level 4 Digital Electrician Certificate & Skill India Card",
        stipend="₹1,500/month stipend provided",
        description="Comprehensive training covering domestic house wiring, single/three phase circuit installation, safety earthling, inverter maintenance, and fault diagnosis."
    )
    t2 = TrainingProgram(
        title="Industrial & Motor Rewinding Safety Course",
        provider_name="Government ITI Thanjavur Extension",
        sector="Industrial Maintenance",
        duration="6 Weeks (120 Hours)",
        mode="In-Person Practical",
        cost="Free",
        location="Govt ITI Campus, Nagapattinam Road, Thanjavur",
        certification="State Skill Directorate Certificate",
        stipend="₹1,000 allowance",
        description="Focused hands-on training for repairing agricultural pump motors, industrial switchgear, and safety protocols."
    )
    t3 = TrainingProgram(
        title="Suryamitra Solar PV Installer & Maintenance",
        provider_name="National Institute of Solar Energy (NISE) Partner",
        sector="Renewable Energy",
        duration="3 Months",
        mode="In-Person",
        cost="Free (Govt. Sponsored)",
        location="Trichy Road Skill Center, Thanjavur",
        certification="Skill India Suryamitra Certified Technician",
        stipend="₹1,500/month",
        description="Learn solar panel roof mounting, wiring, DC-AC inverters, battery banks, and net metering integration."
    )
    db.add_all([t1, t2, t3])

    # 8. Jobs
    j1 = Job(
        title="Junior Electrician / Wireman",
        company_name="Kavitha Energy & Electrical Solutions",
        sector="Electrical & Contracting",
        location_district="Thanjavur",
        location_state="Tamil Nadu",
        salary_range="₹16,000 - ₹22,000 / month",
        experience_required="0-2 years (Freshers with basic knowledge welcome)",
        education_required="10th / 12th / ITI",
        description="Responsible for residential and commercial wiring, troubleshooting electrical fixtures, MCB installations, and solar connections in Thanjavur region.",
        vacancies=4
    )
    j2 = Job(
        title="Solar Panel Installation Technician",
        company_name="SunPower Tamil Nadu Green Energy",
        sector="Renewable Energy",
        location_district="Thanjavur",
        location_state="Tamil Nadu",
        salary_range="₹18,000 - ₹25,000 / month",
        experience_required="1-2 years",
        education_required="12th / ITI / Diploma",
        description="Installation and testing of rooftop solar PV systems on farms and homes. Vehicle fuel allowance provided.",
        vacancies=3
    )
    j3 = Job(
        title="Agricultural Pump Maintenance Technician",
        company_name="Delta Agro Services & Motors",
        sector="Agriculture & Electrical",
        location_district="Thanjavur",
        location_state="Tamil Nadu",
        salary_range="₹15,000 - ₹20,000 / month",
        experience_required="0-1 years",
        education_required="10th / 12th",
        description="Field service for repairing tube-well submersible pumps, starter panels, and farm electrical distribution lines.",
        vacancies=5
    )
    db.add_all([j1, j2, j3])

    # 9. Government Schemes
    s1 = GovernmentScheme(
        scheme_name="Prime Minister's Employment Generation Programme (PMEGP)",
        ministry="Ministry of Micro, Small and Medium Enterprises (MSME)",
        category="Self-Employment Subsidy & Bank Loan",
        subsidy_amount="Up to 35% Capital Subsidy for Rural Areas (Loans up to ₹25-50 Lakhs)",
        eligibility_criteria="Age 18+, Minimum 8th/10th pass for project cost > ₹10 Lakhs. Rural beneficiaries get 35% margin subsidy.",
        benefits="Capital subsidy directly credited to loan account; 3-year lock-in period; low interest rates through nationalized banks.",
        required_documents_json=["Aadhaar Card", "Rural Residence Certificate", "Project Report (Electrical Service Unit)", "Educational Certificate (12th)", "Bank Passbook"],
        application_portal_url="https://www.kviconline.gov.in/pmegpep/",
        description="Credit-linked subsidy programme to generate self-employment through setting up micro-enterprises in non-farm sector."
    )
    s2 = GovernmentScheme(
        scheme_name="Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)",
        ministry="Ministry of Skill Development and Entrepreneurship (MSDE)",
        category="Free Skill Training & Certification",
        subsidy_amount="100% Free Training + ₹1,500/month stipend + Assessment fees covered",
        eligibility_criteria="Any Indian national seeking skill training, youth looking for technical livelihood.",
        benefits="Industry-aligned NSQF curriculum, placement assistance, and nationally recognized digital certificate.",
        required_documents_json=["Aadhaar Card", "Bank Account Details", "Passport Photograph", "Education Proof"],
        application_portal_url="https://www.pmkvyofficial.org/",
        description="Flagship skill certification scheme enabling Indian youth to take up industry-relevant skill training."
    )
    s3 = GovernmentScheme(
        scheme_name="PM Mudra Yojana (Shishu & Kishore Loans)",
        ministry="Ministry of Finance",
        category="Micro-Finance & Working Capital",
        subsidy_amount="Collateral-free business loan: Shishu (up to ₹50,000) & Kishore (₹50,000 to ₹5 Lakhs)",
        eligibility_criteria="Any micro-business owner, independent technician or rural artisan starting an enterprise.",
        benefits="No collateral required, nominal processing fees, overdraft facility on Mudra debit card for purchasing raw materials and tools.",
        required_documents_json=["Identity Proof", "Address Proof", "Quotation of tools and machinery to be purchased"],
        application_portal_url="https://www.mudra.org.in/",
        description="Provides refinancing and micro-credit support for small service providers, shops, and technicians."
    )
    s4 = GovernmentScheme(
        scheme_name="PM Vishwakarma Scheme",
        ministry="Ministry of MSME",
        category="Artisan & Technician Toolkit Incentive",
        subsidy_amount="₹15,000 Modern Toolkit Incentive + Collateral-Free Loans at 5% Concessional Interest",
        eligibility_criteria="Traditional craftsmen and technicians working with hands and tools.",
        benefits="Basic and Advanced skill training with ₹500/day stipend, free toolkit voucher, enterprise credit support.",
        required_documents_json=["Aadhaar Card", "Ration Card", "Mobile Linked Bank Account"],
        application_portal_url="https://pmvishwakarma.gov.in/",
        description="Comprehensive support scheme for artisans and trade workers providing recognition, training, and modern tools."
    )
    db.add_all([s1, s2, s3, s4])

    # 10. Self Employment Ideas
    se1 = SelfEmploymentIdea(
        title="Independent Rural Electrical & Pump Repair Service Hub",
        sector="Electrical & Agriculture Services",
        estimated_investment="₹45,000 - ₹80,000 (Covered by PMEGP / Mudra)",
        potential_monthly_income="₹25,000 - ₹40,000 / month",
        required_skills_json=["Basic Electrical", "Motor Rewinding", "Customer Communication"],
        tools_needed_json=["Digital Multimeter", "Heavy Duty Insulation Tester", "Crimping & Wire Stripper Kit", "Drill & Angle Grinder", "Two-wheeler tool carrier box"],
        linked_scheme_name="PMEGP (35% Subsidy) or PM Mudra Loan",
        roadmap_summary="Complete NSQF Level 4 training -> Register MSME Udyam -> Apply Mudra loan for toolkit -> Service local farms and households.",
        description="High demand service in Thanjavur delta district for repairing agricultural pump sets, domestic house wiring, and emergency blackout troubleshooting."
    )
    se2 = SelfEmploymentIdea(
        title="Rooftop Solar Maintenance & Inverter Servicing Enterprise",
        sector="Renewable Energy Services",
        estimated_investment="₹30,000 - ₹50,000",
        potential_monthly_income="₹28,000 - ₹45,000 / month",
        required_skills_json=["Solar PV Installation", "Electrical Safety", "Inverter Battery Maintenance"],
        tools_needed_json=["Solar Angle Measurement Tool", "Solar Power Clamp Meter", "High-Pressure Panel Cleaning Kit"],
        linked_scheme_name="PM Suryaghar Free Electricity Scheme / Mudra",
        roadmap_summary="Complete Suryamitra training -> Partner with local solar distributors -> Offer quarterly maintenance contracts.",
        description="Rapidly growing sector with government solar rooftop subsidies boosting demand for certified installers and cleaning technicians."
    )
    db.add_all([se1, se2])

    # 11. Voice Call Logs
    vc1 = VoiceCall(
        call_sid="CALL-TN-TH-89102",
        caller_phone="+919876543210",
        beneficiary_id=arun_beneficiary.id,
        provider="MockVoiceProvider",
        direction="inbound",
        language="ta",
        duration_seconds=145,
        status="completed",
        transcript_summary="Caller Karthik from Thanjavur completed AI skill screening. Assessed 12th pass with farming and basic electrical experience. Profile successfully generated and SMS recommendation sent for PMKK training and PMEGP scheme.",
        sentiment="Positive",
        recording_url="/recordings/demo_karthik_call.mp3"
    )
    vc2 = VoiceCall(
        call_sid="CALL-TN-TH-89103",
        caller_phone="+919841234567",
        provider="MockVoiceProvider",
        direction="inbound",
        language="ta",
        duration_seconds=98,
        status="completed",
        transcript_summary="Caller Murugan from Kumbakonam inquired about solar technician training under Suryamitra. System directed to next batch at Trichy Road center.",
        sentiment="Positive"
    )
    vc3 = VoiceCall(
        call_sid="CALL-TN-MD-77120",
        caller_phone="+919765412390",
        provider="Twilio",
        direction="inbound",
        language="hi",
        duration_seconds=115,
        status="completed",
        transcript_summary="Caller Suresh inquired about Mudra loan eligibility for tailoring and garment shop setup.",
        sentiment="Neutral"
    )
    db.add_all([vc1, vc2, vc3])

    # 12. Assessment records
    assessment = Assessment(
        beneficiary_id=arun_beneficiary.id,
        channel="voice_web",
        status="completed",
        current_step="completed",
        language="ta",
        audio_recordings_count=5,
        ai_extracted_json={
            "name": "Karthik M.",
            "education": "12th",
            "occupation": "Farmer",
            "experience_years": 3,
            "skills": ["Farming", "Basic Electrical"],
            "interests": ["Electrical work", "Self employment"],
            "target_career": "Electrician",
            "location": {"state": "Tamil Nadu", "district": "Thanjavur"},
            "language": "ta"
        },
        completed_at=now - timedelta(days=2)
    )
    db.add(assessment)
    db.commit()

    # Assessment Messages
    m1 = AssessmentMessage(
        assessment_id=assessment.id,
        sender="ai",
        message_text="வணக்கம் அருண்! உங்கள் கல்வி மற்றும் பணி அனுபவங்களை எனக்கு கூறுங்கள்.",
        question_key="welcome"
    )
    m2 = AssessmentMessage(
        assessment_id=assessment.id,
        sender="user",
        message_text="நான் 12வது முடித்துள்ளேன். 3 வருடங்களாக விவசாயம் செய்கிறேன். எனக்கு அடிப்படை மின்சார வேலை தெரியும்.",
        question_key="education_skills"
    )
    m3 = AssessmentMessage(
        assessment_id=assessment.id,
        sender="ai",
        message_text="அருமை! எதிர்காலத்தில் நீங்கள் என்ன தொழில் செய்ய விரும்புகிறீர்கள்?",
        question_key="interests"
    )
    m4 = AssessmentMessage(
        assessment_id=assessment.id,
        sender="user",
        message_text="எலக்ட்ரீசியன் தொழில் செய்து சொந்தமாக ஒரு கடை அல்லது சர்வீஸ் சென்டர் வைக்க ஆசைப்படுகிறேன்.",
        question_key="career_goal"
    )
    db.add_all([m1, m2, m3, m4])

    # 13. Notifications for Arun
    n1 = Notification(
        user_id=user_arun.id,
        title="PMEGP 35% Subsidy Scheme Matched!",
        message="Your profile qualifies for up to 35% rural capital subsidy under PMEGP for starting an electrical service business in Thanjavur.",
        type="scheme_alert"
    )
    n2 = Notification(
        user_id=user_arun.id,
        title="Training Batch Starting at PMKK Thanjavur",
        message="A new batch for NSDC Level 4 Electrician Certification starts this Monday. 100% free with ₹1,500 monthly stipend.",
        type="training_update"
    )
    db.add_all([n1, n2])

    db.commit()
    print("Database seeding completed successfully.")

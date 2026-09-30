import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import Base, engine, SessionLocal
from app.database.seed import seed_database

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c

def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "AI Livelihood Assistant" in data["data"]["name"]

def test_auth_login(client):
    response = client.post("/api/v1/auth/login", json={
        "phone": "9876543210",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert data["data"]["user"]["full_name"] == "Karthik M."

def test_jobs_list_and_recommended(client):
    response = client.get("/api/v1/jobs")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) > 0

    # Recommended for Arun (beneficiary_id=1)
    rec_resp = client.get("/api/v1/jobs/recommended/1")
    assert rec_resp.status_code == 200
    rec_data = rec_resp.json()
    assert rec_data["success"] is True
    assert len(rec_data["data"]) > 0
    assert rec_data["data"][0]["match_score"] >= 70.0

def test_schemes_list_and_eligibility(client):
    response = client.get("/api/v1/schemes")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert any("PMEGP" in s["scheme_name"] for s in data["data"])

def test_roadmap_flow(client):
    response = client.get("/api/v1/roadmap/beneficiary/1")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["total_steps"] == 6

def test_admin_dashboard(client):
    response = client.get("/api/v1/admin/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["cards"]["total_beneficiaries"] > 0

def test_voice_simulation(client):
    # Start simulated call
    response = client.post("/api/v1/voice/simulate", json={
        "call_sid": "start",
        "user_input": "",
        "language": "ta"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "call_sid" in data["data"]
    call_sid = data["data"]["call_sid"]

    # Select language 1
    resp2 = client.post("/api/v1/voice/simulate", json={
        "call_sid": call_sid,
        "user_input": "1",
        "language": "ta"
    })
    assert resp2.status_code == 200
    assert resp2.json()["data"]["state"] == "ask_name"

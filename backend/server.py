from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection (must use env vars only)
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# -------------------- Models --------------------
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusCheckCreate(BaseModel):
    client_name: str


class ListingBase(BaseModel):
    brand: str
    model: str
    year: int
    km: int = Field(..., description="Kilométrage")
    engine: str = Field(..., description="Motorisation")
    price: int
    city: str
    imageUrl: Optional[str] = None


class Listing(ListingBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class ListingCreate(ListingBase):
    pass


class ContactMessageCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    message: str


class ImportRequestCreate(BaseModel):
    brandModel: str
    yearMin: Optional[int] = None
    engine: Optional[str] = None
    trim: Optional[str] = None
    budgetMax: Optional[int] = None
    contactName: Optional[str] = None
    contactEmail: Optional[EmailStr] = None
    contactPhone: Optional[str] = None


# -------------------- Routes --------------------
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    await db.status_checks.insert_one(status_obj.model_dump())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# ---- Listings ----
@api_router.post("/listings", response_model=Listing)
async def create_listing(payload: ListingCreate):
    listing = Listing(**payload.model_dump())
    await db.listings.insert_one(listing.model_dump())
    return listing


@api_router.get("/listings", response_model=List[Listing])
async def list_listings(q: Optional[str] = Query(None), limit: int = Query(20, ge=1, le=100)):
    query = {}
    if q:
        query = {
            "$or": [
                {"brand": {"$regex": q, "$options": "i"}},
                {"model": {"$regex": q, "$options": "i"}},
                {"city": {"$regex": q, "$options": "i"}},
            ]
        }
    cursor = db.listings.find(query).sort("createdAt", -1).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [Listing(**doc) for doc in docs]


@api_router.get("/listings/{listing_id}", response_model=Listing)
async def get_listing(listing_id: str):
    doc = await db.listings.find_one({"id": listing_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Listing not found")
    return Listing(**doc)


# ---- Contact ----
@api_router.post("/contact")
async def create_contact_message(payload: ContactMessageCreate):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "createdAt": datetime.utcnow()})
    await db.contact_messages.insert_one(doc)
    # Email sending can be added later (SendGrid/SMTP) using env keys.
    return {"success": True}


# ---- Import Requests ----
@api_router.post("/import-requests")
async def create_import_request(payload: ImportRequestCreate):
    doc = payload.model_dump()
    doc.update({"id": str(uuid.uuid4()), "createdAt": datetime.utcnow()})
    await db.import_requests.insert_one(doc)
    # Email sending can be added later (SendGrid/SMTP) using env keys.
    return {"success": True}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
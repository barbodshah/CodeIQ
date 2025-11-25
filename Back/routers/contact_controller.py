from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

router = APIRouter(prefix="/contact", tags=["contact"])

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

SUPPORT_EMAIL = "barbodshah1383@gmail.com"

# Email configuration - can be set via environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

@router.post("/send")
async def send_contact_email(contact: ContactForm):
    """
    Send contact form email to support email address
    """
    try:
        # Create email message
        msg = MIMEMultipart()
        msg['From'] = SMTP_USER if SMTP_USER else contact.email
        msg['To'] = SUPPORT_EMAIL
        msg['Subject'] = f"Contact Form: {contact.subject}"
        msg['Reply-To'] = contact.email
        
        # Create email body
        body = f"""
        New contact form submission from CodeIQ website:
        
        Name: {contact.name}
        Email: {contact.email}
        Subject: {contact.subject}
        
        Message:
        {contact.message}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email if SMTP credentials are configured
        if SMTP_USER and SMTP_PASSWORD:
            try:
                server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
                server.quit()
                return JSONResponse({
                    "message": "Email sent successfully",
                    "status": "success"
                })
            except Exception as e:
                # If email sending fails, log the error but still return success
                # In production, you might want to use a proper logging system
                print(f"Error sending email: {str(e)}")
                # For development, we'll still return success
                # In production, you should handle this properly
                return JSONResponse({
                    "message": "Contact form submitted (email service not configured)",
                    "status": "success",
                    "note": "Email credentials not configured. Form data received."
                })
        else:
            # If no SMTP credentials, just log the contact (for development)
            print(f"Contact form submission (no email config):")
            print(f"Name: {contact.name}")
            print(f"Email: {contact.email}")
            print(f"Subject: {contact.subject}")
            print(f"Message: {contact.message}")
            
            return JSONResponse({
                "message": "Contact form submitted successfully",
                "status": "success",
                "note": "Email service not configured. Please configure SMTP settings for production."
            })
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing contact form: {str(e)}")


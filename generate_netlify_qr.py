import qrcode

# Netlify URL (update this after getting your actual Netlify URL)
url = "https://vaishnavisrivastav-birthday.netlify.app"

# Create standard QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=15,
    border=4,
)

qr.add_data(url)
qr.make(fit=True)

# Standard QR
img = qr.make_image(fill_color="black", back_color="white")
img.save("Netlify-QR-Code-Birthday-Gift.png")

# Pink QR
qr2 = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=15,
    border=4,
)

qr2.add_data(url)
qr2.make(fit=True)

img2 = qr2.make_image(fill_color="#ff1493", back_color="#ffe0f0")
img2.save("Netlify-Pink-QR-Code-Birthday-Gift.png")

print("✅ Netlify QR Codes successfully generated!")
print(f"📱 Standard QR: Netlify-QR-Code-Birthday-Gift.png")
print(f"🎀 Pink QR: Netlify-Pink-QR-Code-Birthday-Gift.png")
print(f"🌐 URL: {url}")
print("\n⚠️ IMPORTANT: Update the URL in this script after getting your actual Netlify URL!")


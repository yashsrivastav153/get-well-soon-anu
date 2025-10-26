import qrcode
from PIL import Image, ImageDraw

# Your website URL
url = "https://yashsrivastav153.github.io/qr-gift/"

# Create QR code with pink colors
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=15,
    border=4,
)

qr.add_data(url)
qr.make(fit=True)

# Create pink QR code
img = qr.make_image(fill_color="#ff1493", back_color="#ffe0f0")

# Save QR code
img.save("Pink-QR-Code-Birthday-Gift.png")
print("✅ Pink QR Code successfully generated: Pink-QR-Code-Birthday-Gift.png")
print(f"📱 Scan this QR to open: {url}")
print("🎀 Colors: Pink (#ff1493) on Light Pink (#ffe0f0)")


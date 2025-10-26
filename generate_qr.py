import qrcode

# Your website URL
url = "https://yashsrivastav153.github.io/qr-gift/"

# Create QR code
qr = qrcode.QRCode(
    version=1,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)

qr.add_data(url)
qr.make(fit=True)

# Create image
img = qr.make_image(fill_color="black", back_color="white")

# Save QR code
img.save("QR-Code-Birthday-Gift.png")
print("✅ QR Code successfully generated: QR-Code-Birthday-Gift.png")
print(f"📱 Scan this QR to open: {url}")


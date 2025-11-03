import requests
import config
import os

def send_alert(message, image_path=None):
    url = f"https://api.telegram.org/bot{config.TOKEN}/sendMessage"
    payload = {"chat_id": config.CHAT_ID, "text": message}
    try:
        requests.post(url, data=payload)
        if image_path and os.path.exists(image_path):
            url_photo = f"https://api.telegram.org/bot{config.TOKEN}/sendPhoto"
            with open(image_path, "rb") as f:
                requests.post(url_photo, data={"chat_id": config.CHAT_ID}, files={"photo": f})
    except Exception as e:
        print("Error sending Telegram alert:", e)
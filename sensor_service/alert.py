import requests
import config
import os
import base64

def send_alert(message, image_path=None, people_count=0, fan_status=False):

    url = config.SERVER_URL
    
    payload = {
        "message": message,
        "type": "alert",
        "peopleCount": people_count,
        "fanStatus": fan_status
    }
    

    if image_path and os.path.exists(image_path):
        try:
            with open(image_path, "rb") as image_file:
                encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
                payload["snapshot"] = f"data:image/jpeg;base64,{encoded_image}"
        except Exception as e:
            print(f"Error encoding image: {e}")
    

    try:
        response = requests.post(url, json=payload)
        if response.status_code == 201:
            print(f"✓ Alert sent successfully to server")
            return True
        else:
            print(f"✗ Failed to send alert. Status: {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error sending alert to server: {e}")
        return False

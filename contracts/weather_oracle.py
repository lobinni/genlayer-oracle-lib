# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json


class WeatherOracle(gl.Contract):
    city: str
    api_url_template: str   # URL không chứa key, key được proxy xử lý (xem Bước 8)
    last_temp_celsius: str

    def __init__(self, city: str, api_url_template: str):
        self.city = city
        self.api_url_template = api_url_template
        self.last_temp_celsius = ""

    @gl.public.write
    def fetch_weather(self):
        url = self.api_url_template.replace("{city}", self.city)

        def nondet_fetch():
            response = gl.nondet.web.request(url, method="GET")
            if response.status_code >= 400:
                raise gl.UserError(f"Weather API lỗi: {response.status_code}")
            data = json.loads(response.body.decode("utf-8"))
            # Chỉ trả về field ổn định, tránh field thay đổi giữa các lần gọi
            # (timestamp, "feels_like" có thể lệch nhỏ giữa các validator)
            return str(data.get("main", {}).get("temp"))

        self.last_temp_celsius = gl.eq_principle.strict_eq(nondet_fetch)

    @gl.public.view
    def get_temperature(self) -> str:
        return self.last_temp_celsius
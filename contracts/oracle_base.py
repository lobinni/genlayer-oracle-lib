# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json


class OracleBase(gl.Contract):
    """
    Lớp cơ sở cho các oracle gọi API bên ngoài.
    Kế thừa lớp này cho weather/price/social oracle.
    """
    owner: str
    last_result: str

    def __init__(self):
        self.owner = gl.message.sender_address
        self.last_result = ""

    def _fetch_json(self, url: str) -> dict:
        """Helper dùng chung: gọi API và parse JSON, có xử lý lỗi."""
        def nondet_fetch():
            response = gl.nondet.web.request(url, method="GET")
            if response.status_code >= 400 and response.status_code < 500:
                raise gl.UserError(f"API lỗi phía client: {response.status_code}")
            elif response.status_code >= 500:
                raise gl.UserError(f"API tạm thời không khả dụng: {response.status_code}")
            return response.body.decode("utf-8")

        raw = gl.eq_principle.strict_eq(nondet_fetch)
        return json.loads(raw)

    @gl.public.view
    def get_last_result(self) -> str:
        return self.last_result

    @gl.public.write
    def update_owner(self, new_owner: str):
        if gl.message.sender_address != self.owner:
            raise gl.UserError("Chỉ owner mới được đổi quyền")
        self.owner = new_owner
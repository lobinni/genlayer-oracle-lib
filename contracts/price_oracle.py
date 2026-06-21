# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json


class PriceOracle(gl.Contract):
    """
    Oracle giá cả on-chain.
    Gọi qua gateway off-chain (không chứa API key trong URL) — xem docs/secrets-management.md
    Ví dụ data nguồn: CoinGecko, Coinbase, Binance public price API, v.v.
    """

    symbol: str                 # vd: "bitcoin", "BTC-USD"
    api_url_template: str       # vd: "https://your-gateway.com/price?symbol={symbol}"
    last_price_usd: str
    last_updated_by: str

    def __init__(self, symbol: str, api_url_template: str):
        self.symbol = symbol
        self.api_url_template = api_url_template
        self.last_price_usd = ""
        self.last_updated_by = ""

    @gl.public.write
    def fetch_price(self):
        url = self.api_url_template.replace("{symbol}", self.symbol)

        def nondet_fetch():
            response = gl.nondet.web.request(url, method="GET")
            if response.status_code >= 400 and response.status_code < 500:
                raise gl.UserError(f"Price API lỗi phía client: {response.status_code}")
            elif response.status_code >= 500:
                raise gl.UserError(f"Price API tạm thời không khả dụng: {response.status_code}")

            data = json.loads(response.body.decode("utf-8"))

            # QUAN TRỌNG: chỉ trả về field ổn định giữa các lần gọi của validator.
            # Giá có thể lệch rất nhỏ trong vài giây giữa các lần request —
            # nếu dùng strict_eq mà giá lệch dù 1 xu, validator sẽ KHÔNG đồng thuận.
            # Hai lựa chọn xử lý:
            #   (1) Làm tròn giá về N chữ số thập phân trước khi trả về (đơn giản nhất)
            #   (2) Dùng eq_principle.prompt_comparative thay vì strict_eq (cho phép
            #       LLM đánh giá "đủ giống nhau" thay vì so khớp tuyệt đối)
            raw_price = data.get("price", data.get("amount", "0"))
            rounded_price = str(round(float(raw_price), 2))
            return rounded_price

        self.last_price_usd = gl.eq_principle.strict_eq(nondet_fetch)
        self.last_updated_by = gl.message.sender_address

    @gl.public.view
    def get_price(self) -> str:
        return self.last_price_usd

    @gl.public.view
    def get_symbol(self) -> str:
        return self.symbol
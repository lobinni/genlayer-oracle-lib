# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }
from genlayer import *
import json


class SocialOracle(gl.Contract):
    """
    Oracle mạng xã hội on-chain.
    Gọi qua gateway off-chain (key xác thực OAuth/Bearer được gateway tự thêm,
    không lộ trong URL gọi từ contract) — xem docs/secrets-management.md

    Phù hợp cho: đếm follower, đếm like/upvote, kiểm tra nội dung bài đăng,
    xác minh một tài khoản có tồn tại hay không, v.v.
    """

    account_handle: str             # vd: "@username" hoặc subreddit, channel id
    api_url_template: str           # vd: "https://your-gateway.com/social?handle={handle}"
    last_metric_value: str
    last_summary: str               # dùng khi cần LLM tóm tắt nội dung định tính

    def __init__(self, account_handle: str, api_url_template: str):
        self.account_handle = account_handle
        self.api_url_template = api_url_template
        self.last_metric_value = ""
        self.last_summary = ""

    @gl.public.write
    def fetch_follower_count(self):
        """
        Lấy chỉ số định lượng (con số) — dùng strict_eq vì kết quả
        nên giống hệt nhau giữa các validator nếu gateway cache đúng cách.
        """
        url = self.api_url_template.replace("{handle}", self.account_handle)

        def nondet_fetch():
            response = gl.nondet.web.request(url, method="GET")
            if response.status_code >= 400 and response.status_code < 500:
                raise gl.UserError(f"Social API lỗi phía client: {response.status_code}")
            elif response.status_code >= 500:
                raise gl.UserError(f"Social API tạm thời không khả dụng: {response.status_code}")

            data = json.loads(response.body.decode("utf-8"))

            # CHÚ Ý: follower_count, like_count thường thay đổi liên tục theo
            # thời gian thực — đây là field "không ổn định" kinh điển.
            # Nếu strict_eq liên tục fail do validator request lệch nhau vài giây
            # (số follower tăng/giảm), cân nhắc:
            #   - Làm tròn xuống hàng trăm/nghìn gần nhất để giảm nhạy cảm, hoặc
            #   - Dùng eq_principle.prompt_comparative để LLM tự đánh giá
            #     "các con số này có coi là giống nhau không" trong sai số chấp nhận được
            follower_count = data.get("followers_count", data.get("subscriber_count", "0"))
            return str(follower_count)

        self.last_metric_value = gl.eq_principle.strict_eq(nondet_fetch)

    @gl.public.write
    def fetch_content_summary(self, prompt_instruction: str):
        """
        Lấy nội dung định tính (vd: tóm tắt bài đăng gần nhất, đánh giá sentiment)
        — dùng prompt_comparative vì kết quả qua LLM sẽ không khớp tuyệt đối
        từng ký tự giữa các validator, chỉ cần "ý nghĩa giống nhau".
        """
        url = self.api_url_template.replace("{handle}", self.account_handle)

        def nondet_fetch_and_summarize():
            response = gl.nondet.web.request(url, method="GET")
            if response.status_code >= 400:
                raise gl.UserError(f"Social API lỗi: {response.status_code}")

            raw_text = response.body.decode("utf-8")

            # Dùng LLM của GenVM để tóm tắt — validator sẽ tự gọi LLM riêng
            # và so sánh kết quả bằng prompt_comparative bên dưới.
            summary = gl.nondet.exec_prompt(
                f"{prompt_instruction}\n\nDữ liệu thô:\n{raw_text[:2000]}"
            )
            return summary

        self.last_summary = gl.eq_principle.prompt_comparative(
            nondet_fetch_and_summarize,
            criteria="Hai bản tóm tắt được coi là giống nhau nếu truyền tải cùng "
                     "một ý chính, dù khác nhau về cách diễn đạt.",
        )

    @gl.public.view
    def get_follower_count(self) -> str:
        return self.last_metric_value

    @gl.public.view
    def get_summary(self) -> str:
        return self.last_summary
import { ArrowRight, CheckCircle2, Eye, LockKeyhole, Mail } from "lucide-react";

type Props = {
  onLogin: () => void;
};

export function AuthScreen({ onLogin }: Props) {
  return (
    <div className="auth-layout">
      <section className="auth-copy">
        <div className="brand-mark brand-mark--auth">
          <span className="brand-mark__glyph" aria-hidden="true">
            <CheckCircle2 size={18} />
          </span>
          <div>
            <p className="brand-mark__name">SelfRatingApp</p>
            <p className="brand-mark__caption">Hiểu bản thân mỗi ngày, sống tốt hơn mỗi ngày.</p>
          </div>
        </div>

        <div className="auth-card auth-card--login">
          <div className="auth-form">
            <h2>Đăng nhập</h2>
            <p>Dùng email, Google hoặc Facebook để bắt đầu.</p>

            <label className="field">
              <span>Email của bạn</span>
              <div className="field__control">
                <Mail size={16} />
                <input type="email" placeholder="minh.anh@example.com" defaultValue="minh.anh@example.com" />
              </div>
            </label>

            <label className="field">
              <span>Mật khẩu</span>
              <div className="field__control">
                <LockKeyhole size={16} />
                <input type="password" placeholder="••••••••" defaultValue="12345678" />
                <button type="button" className="field__action" aria-label="Hiện mật khẩu">
                  <Eye size={16} />
                </button>
              </div>
            </label>

            <div className="auth-form__row">
              <label className="checkbox">
                <input type="checkbox" defaultChecked />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <button type="button" className="link-button">
                Quên mật khẩu?
              </button>
            </div>

            <button type="button" className="button button--primary" onClick={onLogin}>
              Đăng nhập
              <ArrowRight size={16} />
            </button>

            <div className="divider">
              <span>hoặc</span>
            </div>

            <button type="button" className="button button--secondary" onClick={onLogin}>
              Đăng nhập với Google
            </button>

            <p className="auth-form__footer">
              Chưa có tài khoản? <button type="button" className="link-button">Tạo tài khoản</button>
            </p>
          </div>

          <div className="auth-visual">
            <img src="/assets/login-landscape.png" alt="Khung cảnh bình minh yên tĩnh trên mặt hồ" />
          </div>
        </div>
      </section>

      <aside className="auth-space" aria-hidden="true" />
    </div>
  );
}

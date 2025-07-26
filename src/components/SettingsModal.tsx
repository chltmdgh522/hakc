import React, { useState } from "react";
import settingsBoard from "../assets/Setting/세팅보드.png";
import cancelBtn from "../assets/Setting/취소버튼.png";
import soundEffectBtn from "../assets/Setting/효과음버튼.png";
import bgMusicBtn from "../assets/Setting/배경음버튼.png";
import customerServiceBtn from "../assets/Setting/고객센터버튼.png";
import noticeBtn from "../assets/Setting/공지사항버튼.png";
import onBtn from "../assets/Setting/ON버튼.png";
import offBtn from "../assets/Setting/OFF 버튼.png";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [soundEffectOn, setSoundEffectOn] = useState(true);
  const [bgMusicOn, setBgMusicOn] = useState(true);
  const [kakaoNotificationOn, setKakaoNotificationOn] = useState(true);
  const [pushAlarmOn, setPushAlarmOn] = useState(false);
  const [promoAlarmOn, setPromoAlarmOn] = useState(false);
  const [promoNightAlarmOn, setPromoNightAlarmOn] = useState(false);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  if (!isOpen) return null;

  const handleCustomerService = () => {
    alert("고객센터 문의\n\n📞 전화: 1588-1234\n📧 이메일: support@emotion.com\n⏰ 운영시간: 평일 09:00-18:00");
  };

  const handleNotice = () => {
    setShowNoticeModal(true);
  };

  const handleNoticeClose = () => {
    setShowNoticeModal(false);
  };

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}
        onClick={onClose}
      >
        <div
          style={{
            position: "relative",
            width: "340px",
            height: "600px",
            backgroundImage: `url(${settingsBoard})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            padding: "20px",
            borderRadius: "15px"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 취소 버튼 */}
          <img
            src={cancelBtn}
            alt="취소"
            style={{
              position: "absolute",
              top: "75px",
              right: "20px",
              width: "24px",
              height: "24px",
              cursor: "pointer",
              zIndex: 10
            }}
            onClick={onClose}
          />

          {/* 설정 제목 (removed content) */}
          <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "#333", marginBottom: "30px", marginTop: "10px" }}></div>

          {/* 효과음 버튼 */}
          <div
            style={{
              position: "absolute",
              left: "50px",
              top: "120px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <img
              src={soundEffectBtn}
              alt="효과음"
              style={{
                width: "100px",
                height: "auto",
                cursor: "pointer",
                filter: soundEffectOn ? "brightness(1)" : "brightness(0.5) grayscale(0.5)",
                transition: "filter 0.3s ease"
              }}
              onClick={() => setSoundEffectOn(!soundEffectOn)}
            />
          </div>

          {/* 배경음 버튼 */}
          <div
            style={{
              position: "absolute",
              left: "185px",
              top: "120px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}
          >
            <img
              src={bgMusicBtn}
              alt="배경음"
              style={{
                width: "100px",
                height: "auto",
                cursor: "pointer",
                filter: bgMusicOn ? "brightness(1)" : "brightness(0.5) grayscale(0.5)",
                transition: "filter 0.3s ease"
              }}
              onClick={() => setBgMusicOn(!bgMusicOn)}
            />
          </div>

          {/* 알림 설정들 */}
          <div
            style={{
              position: "absolute",
              left: "55px",
              top: "210px",
              width: "230px"
            }}
          >
            {/* 카카오톡 알림받기 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px",
                fontSize: "14px",
                color: "#333"
              }}
            >
              <span style={{ fontWeight: "bold" }}>카카오톡 알림받기</span>
              <img
                src={kakaoNotificationOn ? onBtn : offBtn}
                alt={kakaoNotificationOn ? "ON" : "OFF"}
                style={{
                  width: "75px",
                  height: "auto",
                  cursor: "pointer",
                  filter: kakaoNotificationOn ? "brightness(1)" : "brightness(0.7)",
                  transition: "filter 0.3s ease"
                }}
                onClick={() => setKakaoNotificationOn(!kakaoNotificationOn)}
              />
            </div>

            {/* 구분선 */}
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#FFFFFF",
                marginBottom: "10px"
              }}
            />

            {/* 푸쉬알람 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "3px",
                fontSize: "14px",
                color: "#333"
              }}
            >
              <span style={{ fontWeight: "bold" }}>푸쉬알람</span>
              <img
                src={pushAlarmOn ? onBtn : offBtn}
                alt={pushAlarmOn ? "ON" : "OFF"}
                style={{
                  width: "75px",
                  height: "auto",
                  cursor: "pointer",
                  filter: pushAlarmOn ? "brightness(1)" : "brightness(0.7)",
                  transition: "filter 0.3s ease"
                }}
                onClick={() => setPushAlarmOn(!pushAlarmOn)}
              />
            </div>

            {/* 홍보성알람 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "3px",
                fontSize: "14px",
                color: "#333"
              }}
            >
              <span style={{ fontWeight: "bold" }}>홍보성알람</span>
              <img
                src={promoAlarmOn ? onBtn : offBtn}
                alt={promoAlarmOn ? "ON" : "OFF"}
                style={{
                  width: "75px",
                  height: "auto",
                  cursor: "pointer",
                  filter: promoAlarmOn ? "brightness(1)" : "brightness(0.7)",
                  transition: "filter 0.3s ease"
                }}
                onClick={() => setPromoAlarmOn(!promoAlarmOn)}
              />
            </div>

            {/* 홍보성 야간 알림 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "3px",
                fontSize: "14px",
                color: "#333"
              }}
            >
              <span style={{ fontWeight: "bold" }}>홍보성 야간 알림</span>
              <img
                src={promoNightAlarmOn ? onBtn : offBtn}
                alt={promoNightAlarmOn ? "ON" : "OFF"}
                style={{
                  width: "75px",
                  height: "auto",
                  cursor: "pointer",
                  filter: promoNightAlarmOn ? "brightness(1)" : "brightness(0.7)",
                  transition: "filter 0.3s ease"
                }}
                onClick={() => setPromoNightAlarmOn(!promoNightAlarmOn)}
              />
            </div>
          </div>

          {/* 고객센터 버튼 */}
          <img
            src={customerServiceBtn}
            alt="고객센터"
            style={{
              position: "absolute",
              left: "60px",
              top: "443px",
              width: "98px",
              height: "auto",
              cursor: "pointer"
            }}
            onClick={handleCustomerService}
          />

          {/* 공지사항 버튼 */}
          <img
            src={noticeBtn}
            alt="공지사항"
            style={{
              position: "absolute",
              left: "175px",
              top: "443px",
              width: "98px",
              height: "auto",
              cursor: "pointer"
            }}
            onClick={handleNotice}
          />

          {/* 저작권 정보 (removed content) */}
          <div style={{ position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)", fontSize: "12px", color: "#999", textAlign: "center" }}></div>
        </div>
      </div>

      {/* 공지사항 모달 */}
      {showNoticeModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000
          }}
          onClick={handleNoticeClose}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "30px",
              maxWidth: "400px",
              width: "90%",
              maxHeight: "80%",
              overflow: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 20px 0", color: "#333", textAlign: "center" }}>📢 공지사항</h2>
            
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#e74c3c", margin: "0 0 10px 0" }}>🔴 [긴급] 서버 점검 안내</h3>
              <p style={{ margin: "0 0 15px 0", lineHeight: "1.6" }}>
                <strong>일시:</strong> 2024년 1월 15일 (월) 02:00 ~ 06:00<br/>
                <strong>내용:</strong> 시스템 업그레이드를 위한 서버 점검<br/>
                점검 시간 동안 서비스 이용이 제한됩니다.
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#3498db", margin: "0 0 10px 0" }}>🔵 [업데이트] 새로운 기능 추가</h3>
              <p style={{ margin: "0 0 15px 0", lineHeight: "1.6" }}>
                <strong>추가된 기능:</strong><br/>
                • 감정 분석 결과 저장 기능<br/>
                • 개인화된 추천 시스템<br/>
                • 다크 모드 지원
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ color: "#f39c12", margin: "0 0 10px 0" }}>🟡 [이벤트] 신규 사용자 이벤트</h3>
              <p style={{ margin: "0 0 15px 0", lineHeight: "1.6" }}>
                <strong>기간:</strong> 2024년 1월 1일 ~ 1월 31일<br/>
                <strong>혜택:</strong> 신규 가입 시 프리미엄 기능 30일 무료 이용<br/>
                친구 초대 시 추가 혜택도 제공됩니다!
              </p>
            </div>

            <button
              onClick={handleNoticeClose}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer",
                marginTop: "20px"
              }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(SettingsModal); 
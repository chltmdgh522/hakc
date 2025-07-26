import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnalysisData {
  summary: string;
  strengths: string;
  cautions: string;
  training: string;
  guide: string;
}

interface AnalysisListPageProps {
  onBack: () => void;
  quizRecordId?: string; // quizRecordId prop 추가
}

const TITLES = [
  '발달 특성 요약',
  '강점',
  '주의가 필요한 영역',
  '훈련제안',
  '행동 가이드',
];

const AnalysisListPage: React.FC<AnalysisListPageProps> = ({ onBack, quizRecordId }) => {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [openIdx, setOpenIdx] = useState(0); // 첫번째만 기본 오픈
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalysisData = async () => {
      if (!quizRecordId) {
        console.log('quizRecordId가 없어서 기본 데이터 사용');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('AI 분석 API 호출:', `/api/record/ai/${quizRecordId}`);
        
        // 실제 API 호출
        const response = await fetch(`/api/record/ai/${quizRecordId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('AI 분석 데이터를 불러오는데 실패했습니다.');
        }

        const aiData = await response.json();
        console.log('AI 분석 API 응답:', aiData);
        
        // API 응답 구조에 맞게 변환
        if (aiData && aiData.length >= 5) {
          setData({
            summary: aiData[0].content,
            strengths: aiData[1].content,
            cautions: aiData[2].content,
            training: aiData[3].content,
            guide: aiData[4].content,
          });
        } else {
          throw new Error('AI 분석 데이터 형식이 올바르지 않습니다.');
        }
        
      } catch (error) {
        console.error('AI 분석 데이터 로드 실패:', error);
        setError('AI 분석 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadAnalysisData();
  }, [quizRecordId]);

  const contents = data ? [
    data.summary,
    data.strengths,
    data.cautions,
    data.training,
    data.guide,
  ] : [];

  // 에러 상태
  if (error) {
    return (
      <div
        style={{
          width: '100%',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #e9f8f8 0%, #f0f9ff 50%, #e6f3ff 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div style={{ textAlign: 'center', color: '#ef4444', fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: '#1e3a8a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 60, opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{ 
          width: '100%', 
          minHeight: '130vh', 
          background: 'linear-gradient(135deg, #e9f8f8 0%, #f0f9ff 50%, #e6f3ff 100%)', 
          borderRadius: 10, 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          paddingBottom: 40,
          overflowY: 'auto',
          maxHeight: '100vh',
          scrollbarWidth: 'thin',
          scrollbarColor: '#5B93C6 #e9f8f8'
        }}
      >
        <style>{`
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: #e9f8f8;
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb {
            background: #5B93C6;
            border-radius: 3px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #4a7bb8;
          }
        `}</style>
        {/* 뒤로가기 버튼 */}
        <motion.div 
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '30px 0 0 0',
            position: 'relative',
            width: '100%',
            height: '40px',
            maxWidth: 400
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <button 
            onClick={onBack} 
            style={{ 
              background: 'none', 
              border: 'none', 
              padding: 0, 
              cursor: 'pointer',
              position: 'absolute',
              left: '10px',
              top: 10
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="#E6F3FF"/>
              <path d="M23 14L17 20L23 26" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
        {/* 제목 - 그라데이션 배경 */}
        <motion.div 
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #5B93C6 0%, #4a7bb8 50%, #3d6ba8 100%)',
            color: '#fff',
            fontWeight: 900,
            fontSize: 26,
            textAlign: 'center',
            padding: '18px 0 14px 0',
            margin: '24px 0 32px 0',
            letterSpacing: '-1px',
            borderRadius: 0,
            boxShadow: '0 4px 20px rgba(91, 147, 198, 0.3)',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span style={{ color: '#fff', fontWeight: 900 }}>AI기반 맞춤형 분석 리스트</span>
        </motion.div>
        {/* 아코디언 리스트 */}
        <div style={{ 
          width: '100%', 
          maxWidth: '100%', 
          margin: '0 auto', 
          padding: '0 12px',
          maxHeight: '100%',
          overflowY: 'auto',
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
          minHeight: 0
        }}>
          <style>
            {`
              div::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          {TITLES.map((title, idx) => (
            <motion.div 
              key={title} 
              style={{ marginBottom: 18 }}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <motion.div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 900,
                  fontSize: 22,
                  marginBottom: 0,
                  color: '#222',
                  cursor: 'pointer',
                  userSelect: 'none',
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  background: 'rgba(255, 255, 255, 0.95)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ 
                  background: '#FFE89A', 
                  borderRadius: 6, 
                  padding: '4px 12px', 
                  marginRight: 12,
                  fontSize: 20
                }}>{title}</span>
                <motion.span
                  animate={{ rotate: openIdx === idx ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ 
                    marginLeft: 'auto', 
                    marginRight: 6, 
                    fontSize: 28, 
                    color: '#5B93C6', 
                    display: 'flex', 
                    alignItems: 'center',
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
                  }}
                >
                  {openIdx === idx ? '⌃' : '⌄'}
                </motion.span>
              </motion.div>
              <motion.div
                initial={false}
                animate={{ 
                  height: openIdx === idx ? 'auto' : 0, 
                  opacity: openIdx === idx ? 1 : 0,
                  scale: openIdx === idx ? 1 : 0.95
                }}
                transition={{ 
                  duration: 0.4, 
                  ease: "easeInOut",
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.2 }
                }}
                style={{
                  overflow: 'visible',
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 12,
                  boxShadow: openIdx === idx ? '0 8px 32px rgba(91, 147, 198, 0.15)' : 'none',
                  marginTop: 8,
                  marginBottom: openIdx === idx ? 8 : 0,
                  padding: openIdx === idx ? 20 : 0,
                  border: openIdx === idx ? '1px solid rgba(91, 147, 198, 0.2)' : 'none',
                  minHeight: openIdx === idx ? 'auto' : 0,
                  maxHeight: openIdx === idx ? 'none' : 0,
                  backdropFilter: 'blur(10px)',
                  transformOrigin: 'top'
                }}
              >
                {loading ? (
                  <motion.div 
                    style={{ textAlign: 'center', color: '#5B93C6', fontWeight: 700, fontSize: 18, padding: 24 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    로딩 중...
                  </motion.div>
                ) : (
                  <motion.div 
                    style={{ whiteSpace: 'pre-line', color: '#222', fontSize: 17, lineHeight: 1.7 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {contents[idx]}
                  </motion.div>
                )}
              </motion.div>
              <motion.div 
                style={{ 
                  height: 3, 
                  background: 'linear-gradient(90deg, #5B93C6 0%, #4a7bb8 100%)', 
                  borderRadius: 2, 
                  marginTop: 6 
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnalysisListPage; 
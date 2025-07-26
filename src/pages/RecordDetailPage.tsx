import React, { useEffect, useState } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';
import { motion, AnimatePresence } from 'framer-motion';
import crownSuccess from '../assets/성공왕관.png';
import AnalysisListPage from './AnalysisListPage';
import { fetchQuizAnalysis, fetchAIAnalysis } from '../utils/gameApi';
import type { QuizAnalysisResponse, AIAnalysisItem } from '../utils/gameApi';

interface RecordDetail {
  nickname: string;
  date: string;
  playTime: string;
  crowns: number;
  scores: {
    감정인식: number;
    타인에대한관심: number;
    맥락이해: number;
    공감능력: number;
  };
}

interface RecordDetailPageProps {
  recordId: string;
  onBack: () => void;
}

const RecordDetailPage: React.FC<RecordDetailPageProps> = ({ recordId, onBack }) => {
  const [detail, setDetail] = useState<RecordDetail | null>(null);
  const [quizRecord, setQuizRecord] = useState<QuizAnalysisResponse | null>(null);
  const [aiRecord, setAiRecord] = useState<AIAnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    const loadRecordDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('RecordDetailPage: recordId 받음:', recordId);
        console.log('RecordDetailPage: API 호출 URL:', `/api/record/${recordId}`);

        // 퀴즈 분석 결과와 AI 분석 결과를 병렬로 로드
        const [quizData, aiData] = await Promise.all([
          fetchQuizAnalysis(recordId),
          fetchAIAnalysis(recordId)
        ]);

        if (quizData) {
          setQuizRecord(quizData);
          
          console.log('퀴즈 분석 API 응답:', quizData);
          console.log('점수 데이터:', {
            emotionPoint: quizData.pointRes.emotionPoint,
            interestPoint: quizData.pointRes.interestPoint,
            contextPoint: quizData.pointRes.contextPoint,
            sympathyPoint: quizData.pointRes.sympathyPoint
          });
          
          // RecordDetail 형식으로 변환 (API 응답 구조에 맞게)
          const processedScores = {
            감정인식: Math.max(0, Math.min(100, quizData.pointRes.emotionPoint)),
            타인에대한관심: Math.max(0, Math.min(100, quizData.pointRes.interestPoint)),
            맥락이해: Math.max(0, Math.min(100, quizData.pointRes.contextPoint)),
            공감능력: Math.max(0, Math.min(100, quizData.pointRes.sympathyPoint)),
          };
          
          const totalPositivePoints = Math.max(0, quizData.pointRes.emotionPoint) + 
                                    Math.max(0, quizData.pointRes.interestPoint) + 
                                    Math.max(0, quizData.pointRes.contextPoint) + 
                                    Math.max(0, quizData.pointRes.sympathyPoint);
          const crowns = Math.floor(totalPositivePoints / 25);
          
          console.log('처리된 점수:', processedScores);
          console.log('총 양수 점수:', totalPositivePoints);
          console.log('계산된 왕관 수:', crowns);
          
          setDetail({
            nickname: quizData.name,
            date: new Date(quizData.createdAt).toLocaleDateString('ko-KR'),
            playTime: quizData.timeRes.allTime,
            crowns: crowns,
            scores: processedScores
          });
        }

        if (aiData) {
          setAiRecord(aiData);
        }

      } catch (error) {
        console.error('기록 상세 정보 로드 실패:', error);
        setError('기록 상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadRecordDetail();
  }, [recordId]);

  if (showAnalysis) {
    return <AnalysisListPage onBack={() => setShowAnalysis(false)} quizRecordId={recordId} />;
  }

  if (loading) return (
    <motion.div 
      style={{padding: 60, textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src={crownSuccess}
        alt="로딩중"
        style={{
          width: 80,
          height: 80,
          marginBottom: 18,
        }}
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 1.2, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      <motion.div 
        style={{fontSize: 22, fontWeight: 700, color: '#1e3a8a', textShadow: '0 1px 8px #fff'}}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        로딩 중...
      </motion.div>
    </motion.div>
  );
  
  if (error) return <div style={{padding: 40, color: 'red'}}>{error}</div>;
  if (!detail) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          minHeight: '100vh',
          width: '100%',
          background: 'linear-gradient(135deg, #e9f8f8 0%, #e6f3ff 100%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '40px 0', // 상하 여백 동일하게
        }}
      >
        <motion.div
          style={{
            width: 380,
            background: '#fff',
            borderRadius: 24,
            boxShadow: '0 8px 32px rgba(91,147,198,0.10)',
            padding: '32px 0 32px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            minHeight: 680,
            maxWidth: '95vw',
          }}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* 상단: 뒤로가기 버튼 */}
          <motion.div
            style={{
              position: 'absolute',
              left: 24,
              top: 24,
              zIndex: 2,
            }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.18 }}
          >
            <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="#E6F3FF"/>
                <path d="M23 14L17 20L23 26" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </motion.div>
          {/* 제목 */}
          <motion.div
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: 28,
              fontWeight: 900,
              color: '#1e3a8a',
              letterSpacing: '-1px',
              marginBottom: 24,
              marginTop: 30,
              textShadow: '0 2px 8px #fff, 0 1px 0 #bcd',
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {detail.nickname} <span style={{ fontWeight: 700, color: '#4a7bb8' }}>용사의 모험 기록</span>
          </motion.div>
          {/* 날짜/플레이시간 카드 */}
          <motion.div
            style={{
              width: '90%',
              background: '#fff',
              borderRadius: 20,
              boxShadow: '0 4px 24px rgba(30,58,138,0.08)',
              padding: 24,
              marginBottom: 32,
              marginTop: 0,
              minHeight: 80,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div style={{ fontSize: 17, color: '#1e3a8a', fontWeight: 700, marginBottom: 4 }}>진행일자 : {detail.date}</div>
            <div style={{ fontSize: 17, color: '#1e3a8a', fontWeight: 700 }}>플레이시간 : {detail.playTime}</div>
          </motion.div>
          {/* 점수 카드 */}
          <motion.div
            style={{
              width: '90%',
              background: '#fff',
              borderRadius: 20,
              boxShadow: '0 4px 24px rgba(91,147,198,0.08)',
              padding: 24,
              marginBottom: 0,
              marginTop: 0,
              minHeight: 180,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#222',
              marginBottom: 18,
              width: '100%',
              textAlign: 'left',
            }}>
              항목별 종합 점수
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12, // gap을 약간 줄임
              width: '100%',
              alignItems: 'center',
              // maxHeight, overflowY 등 스크롤 관련 속성 완전히 제거
              paddingRight: 0,
            }}>
              {Object.entries(detail.scores).map(([label, value], idx) => (
                <motion.div
                  key={label}
                  style={{
                    backgroundColor: '#f5faff',
                    borderRadius: 14,
                    padding: '12px 16px', // padding도 약간 줄임
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    minWidth: 0,
                    boxShadow: '0 2px 8px rgba(91, 147, 198, 0.08)',
                    border: '1.5px solid #e6f3ff',
                    marginBottom: 2,
                  }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.1 + 0.4,
                    ease: 'easeOut',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#5B93C6', fontSize: 16, minWidth: 90 }}>{label}</div>
                  <div style={{ flex: 1, marginLeft: 16 }}>
                    <ProgressBar
                      completed={value}
                      maxCompleted={8}
                      height="16px"
                      bgColor="#5B93C6"
                      baseBgColor="#e6f3ff"
                      borderRadius="8px"
                      animateOnRender
                      isLabelVisible={false}
                      transitionDuration="1s"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          {/* 분석리스트 보기 버튼 */}
          <motion.div
            style={{ width: '90%', display: 'flex', justifyContent: 'center', marginTop: 40 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              style={{
                width: '100%',
                maxWidth: 340,
                padding: 18,
                background: '#5B93C6',
                border: '2px dashed #4a7bb8',
                borderRadius: 16,
                fontWeight: 'bold',
                fontSize: 18,
                color: '#fff',
                display: 'block',
                boxShadow: '0 4px 16px rgba(91, 147, 198, 0.08)',
                backdropFilter: 'blur(10px)'
              }}
              onClick={() => setShowAnalysis(true)}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 8px 24px rgba(91, 147, 198, 0.13)',
                background: '#4a7bb8',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              분석리스트 보기
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecordDetailPage; 
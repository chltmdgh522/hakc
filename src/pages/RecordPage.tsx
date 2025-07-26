import React, { useState, useEffect } from 'react';
import { Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import RecordDetailPage from './RecordDetailPage';
import { COLORS } from '../utils/styles';
import { fetchQuizRecords, QuizRecordListItem } from '../utils/gameApi';

interface RecordData {
  session: number;
  score: number;
  date: string;
  quizRecordId: number;
}

const RecordPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [chartData, setChartData] = useState([
    { session: 1, score: 3, date: '2025.07.21', quizRecordId: 1 },
    { session: 2, score: 6, date: '2025.07.22', quizRecordId: 2 },
    { session: 3, score: 8, date: '2025.07.23', quizRecordId: 3 },
    { session: 4, score: 0, date: '2025.07.24', quizRecordId: 4 },
  ]);
  const [records, setRecords] = useState<RecordData[]>([
    { session: 1, score: 3, date: '2025.07.21', quizRecordId: 1 },
    { session: 2, score: 6, date: '2025.07.22', quizRecordId: 2 },
    { session: 3, score: 8, date: '2025.07.23', quizRecordId: 3 },
  ]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  useEffect(() => {
    const loadRecords = async () => {
      try {
        console.log('기록 데이터 로드 시작...');
        
        // 실제 API 호출
        const quizRecords = await fetchQuizRecords();
        console.log('기록 API 응답:', quizRecords);
        
        if (quizRecords && quizRecords.length > 0) {
          console.log('첫 번째 레코드:', quizRecords[0]);
          console.log('첫 번째 레코드 quizRecordId:', quizRecords[0].quizRecordId);
          
          // API 데이터로 차트 데이터 변환
          const chartDataTransformed = quizRecords.map((record, index) => {
            console.log(`레코드 ${index + 1}:`, record);
            console.log(`레코드 ${index + 1} quizRecordId:`, record.quizRecordId);
            return {
              session: index + 1,
              score: record.average, // API에서는 average 필드 사용
              date: new Date(record.createdAt).toLocaleDateString('ko-KR'), // createdAt을 날짜로 변환
              quizRecordId: record.quizRecordId // quizRecordId 필드 사용
            };
          });
          
          console.log('변환된 차트 데이터:', chartDataTransformed);
          setChartData(chartDataTransformed);
          setRecords(chartDataTransformed);
        } else {
          // 데이터가 없을 때 빈 배열로 설정
          console.log('기록 데이터가 없습니다.');
          setChartData([]);
          setRecords([]);
        }
      } catch (error) {
        console.error('기록 로드 실패:', error);
      }
    };

    loadRecords();
  }, []);

  if (selectedRecordId !== null) {
    return <RecordDetailPage recordId={selectedRecordId} onBack={() => setSelectedRecordId(null)} />;
  }

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
          padding: '32px 0',
        }}
      >
        <motion.div
          style={{
            width: 380,
            background: 'rgba(255,255,255,0.95)',
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
              color: COLORS.primary,
              letterSpacing: '-1px',
              marginBottom: 24,
              marginTop: 8,
              textShadow: '0 2px 8px #fff, 0 1px 0 #bcd',
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            회차별점수
          </motion.div>
          {/* 차트 카드 */}
          <motion.div
            style={{
              width: '90%',
              background: '#1e3a8a',
              borderRadius: 20,
              boxShadow: '0 4px 24px rgba(30,58,138,0.13)',
              padding: 24,
              marginBottom: 32,
              marginTop: 0,
              minHeight: 260,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            initial={{ y: 2, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis
                  dataKey="session"
                  tick={{ fill: '#ffffff' }}
                  tickFormatter={(value) => `${value}회차`}
                />
                <YAxis
                  tick={{ fill: '#ffffff' }}
                  domain={[0, 10]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#5B93C6"
                  strokeWidth={3}
                  dot={{ fill: '#5B93C6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Bar
                  dataKey="score"
                  fill="#FFD93D"
                  radius={[8, 8, 0, 0]}
                  opacity={0.9}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>
          {/* 기록 리스트 카드 */}
          <motion.div
            style={{
              width: '90%',
              background: 'rgba(245,245,245,0.95)',
              borderRadius: 20,
              boxShadow: '0 4px 24px rgba(91,147,198,0.10)',
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
              나의 기록 리스트
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              width: '100%',
              alignItems: 'center',
              maxHeight: 220,
              overflowY: 'auto',
              paddingRight: 4,
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none', /* IE and Edge */
            }}>
              <style>
                {`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}
              </style>
              {records.map((record, idx) => (
                <motion.div
                  key={record.session}
                  style={{
                    backgroundColor: '#5B93C6',
                    borderRadius: 14,
                    padding: '14px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(91, 147, 198, 0.13)',
                    border: '1.5px solid #4a7bb8',
                    width: '100%',
                    minWidth: 0,
                    transition: 'all 0.2s',
                  }}
                  onClick={() => setSelectedRecordId(record.quizRecordId.toString())}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: '0 8px 24px rgba(91, 147, 198, 0.18)',
                    backgroundColor: '#4a7bb8',
                  }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.1 + 0.4,
                    ease: 'easeOut',
                  }}
                >
                  <div style={{
                    backgroundColor: '#fff',
                    color: '#5B93C6',
                    padding: '6px 16px',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 700,
                    boxShadow: '0 2px 8px rgba(96, 165, 250, 0.10)',
                  }}>
                    {record.session}회차
                  </div>
                  <div style={{
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 500,
                  }}>
                    {record.date}
                  </div>
                </motion.div>
              ))}
              {records.length === 0 && (
                <motion.div
                  style={{
                    color: '#666',
                    fontSize: 16,
                    fontWeight: 500,
                    textAlign: 'center',
                    padding: '40px 20px',
                    width: '100%',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  아직 기록이 없습니다.<br />
                  퀴즈를 풀어보세요! 🎯
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecordPage; 
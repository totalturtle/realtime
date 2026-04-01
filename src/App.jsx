import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Globe, Clock, Calendar, RotateCcw, Plus, X, Search, Trash2, Sun, MapPin, ChevronDown, ChevronUp, LayoutGrid, List, Pencil, AlarmClock, MinusCircle, BellRing, ChevronRight, Check, Menu, Combine, Settings, Moon, Monitor, Bookmark, Save, FolderOpen, Play, Users, Languages, Crown, CheckCircle } from 'lucide-react';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { LocalNotifications } from '@capacitor/local-notifications';

// === 다국어 UI 사전 ===
const UI = {
  worldClock: { ko: '세계 시계', en: 'World Clock', ja: '世界時計' },
  globalAlarm: { ko: '글로벌 알람', en: 'Global Alarm', ja: 'グローバルアラーム' },
  savedList: { ko: '저장 리스트', en: 'Saved Lists', ja: '保存リスト' },
  globalTime: { ko: '타임얼라인', en: 'TimeAlign', ja: 'TimeAlign' },
  baseCity: { ko: '기준 도시', en: 'Base', ja: '基準' },
  baseCityLabel: { ko: '기준 도시', en: 'Base City', ja: '基準都市' },
  changeBaseCity: { ko: '기준 도시 변경', en: 'Change Base City', ja: '基準都市を変更' },
  specificDateTime: { ko: '특정 날짜/시간 지정', en: 'Set Specific Date/Time', ja: '特定の日時を指定' },
  local: { ko: '현지', en: 'Local', ja: '現地' },
  backToRealTime: { ko: '현재 실시간으로 복귀', en: 'Back to Real Time', ja: '現在のリアルタイムに戻る' },
  backToRealTimeModal: { ko: '현재 실시간으로\n복귀', en: 'Back to\nReal Time', ja: 'リアルタイムに\n戻る' },
  realTimeSync: { ko: '실시간 동기화', en: 'Real-time Sync', ja: 'リアルタイム同期' },
  reset: { ko: '초기화', en: 'Reset', ja: '初期化' },
  findMeetingTime: { ko: '추가된 도시들의 적절한 회의 시간 찾기', en: 'Find optimal meeting time', ja: '追加された都市の適切な会議時間を見つける' },
  saveCombo: { ko: '현재 조합을 저장리스트에 추가', en: 'Save current list', ja: '現在のリストを保存' },
  mergeTimes: { ko: '같은 시간대 도시 합치기', en: 'Merge Same Timezones', ja: '同じ時間帯の都市を結合' },
  appSettings: { ko: '앱 설정', en: 'App Settings', ja: 'アプリ設定' },
  addCityBtn: { ko: '새로운 도시 추가', en: 'Add New City', ja: '新しい都市を追加' },
  addCityTitle: { ko: '도시 추가', en: 'Add City', ja: '都市の追加' },
  searchPlaceholder: { ko: '도시명 또는 국가명 검색...', en: 'Search city or country...', ja: '都市名または国名を検索...' },
  merged: { ko: '합쳐짐', en: 'Merged', ja: '結合済み' },
  timeChangeTitle: { ko: '시간 변경', en: 'Change Time', ja: '時間変更' },
  done: { ko: '완료', en: 'Done', ja: '完了' },
  edit: { ko: '편집', en: 'Edit', ja: '編集' },
  noSavedLists: { ko: '저장된 도시 묶음이 없습니다.', en: 'No saved city lists.', ja: '保存された都市リストはありません。' },
  noSavedDesc: { ko: '세계 시계 탭에서 저장 아이콘을 눌러보세요.', en: 'Tap the save icon in the World Clock tab.', ja: '世界時計タブで保存アイコンをタップしてください。' },
  citiesCount: { ko: '도시', en: 'Cities', ja: '都市' },
  savedOn: { ko: '저장됨', en: 'Saved on', ja: '保存日' },
  load: { ko: '불러오기', en: 'Load', ja: '読み込む' },
  noAlarms: { ko: '설정된 글로벌 알람이 없습니다.', en: 'No global alarms set.', ja: '設定されたグローバルアラームはありません。' },
  targetCityTime: { ko: '기준 도시 시간 보기', en: 'Target City Time', ja: 'ターゲット都市の時間' },
  localDeviceTime: { ko: '내 기기 시간 보기', en: 'My Device Time', ja: '自分のデバイスの時間' },
  myDevice: { ko: '내 기기', en: 'My Device', ja: '自分のデバイス' },
  addAlarm: { ko: '글로벌 알람 추가', en: 'Add Global Alarm', ja: 'グローバルアラームを追加' },
  editAlarm: { ko: '알람 편집', en: 'Edit Alarm', ja: 'アラームの編集' },
  cancel: { ko: '취소', en: 'Cancel', ja: 'キャンセル' },
  save: { ko: '저장', en: 'Save', ja: '保存' },
  alarmDateTime: { ko: '날짜/시간', en: 'Date/Time', ja: '日付/時間' },
  alarmDesc1: { ko: '이 알람은 내 기기(', en: 'This alarm will ring at ', ja: 'このアラームはデバイス(' },
  alarmDesc2: { ko: ') 시간 기준으로', en: ' based on your device (', ja: ') 時間で' },
  alarmDesc3: { ko: '에 울립니다.', en: ').', ja: 'に鳴ります。' },
  label: { ko: '레이블', en: 'Label', ja: 'ラベル' },
  alarmLabelPlaceholder: { ko: '알람 이름을 입력하세요', en: 'Enter alarm name', ja: 'アラーム名を入力してください' },
  sound: { ko: '사운드', en: 'Sound', ja: 'サウンド' },
  back: { ko: '뒤로', en: 'Back', ja: '戻る' },
  ringtone: { ko: '벨소리', en: 'Ringtone', ja: '着信音' },
  saveCurrentBundle: { ko: '현재 묶음 저장', en: 'Save Current List', ja: '現在のリストを保存' },
  listName: { ko: '리스트 이름', en: 'List Name', ja: 'リスト名' },
  listNamePlaceholder: { ko: '예: 유럽 출장용', en: 'e.g. Europe Business Trip', ja: '例: ヨーロッパ出張用' },
  toBeSaved: { ko: '저장될 도시', en: 'Cities to be saved', ja: '保存される都市' },
  saveAction: { ko: '저장하기', en: 'Save', ja: '保存する' },
  optimalMeeting: { ko: '최적의 회의 시간', en: 'Optimal Meeting Time', ja: '最適な会議時間' },
  basedOn: { ko: '지정된', en: 'Based on', ja: '指定された' },
  dayBase: { ko: '하루 기준', en: '', ja: 'の1日基準' },
  needMoreCities: { ko: '최소 2개 이상의 도시가 필요합니다.', en: 'At least 2 cities are required.', ja: '少なくとも2つの都市が必要です。' },
  perfectMatch: { ko: '완벽한 겹침! (모두 업무 시간)', en: 'Perfect Match! (All in work hours)', ja: '完璧に一致！(全員が業務時間)' },
  goodMatch: { ko: '추천하는 시간대', en: 'Recommended Time', ja: '推奨される時間帯' },
  compromiseMatch: { ko: '가장 나은 타협점 (수면 시간 포함)', en: 'Best Compromise (Includes sleep hours)', ja: '最良の妥協点 (睡眠時間を含む)' },
  work: { ko: '업무', en: 'Work', ja: '業務' },
  extend: { ko: '연장', en: 'Extend', ja: '延長' },
  sleep: { ko: '수면', en: 'Sleep', ja: '睡眠' },
  theme: { ko: '화면 테마', en: 'App Theme', ja: 'アプリのテーマ' },
  light: { ko: '라이트', en: 'Light', ja: 'ライト' },
  dark: { ko: '다크', en: 'Dark', ja: 'ダーク' },
  system: { ko: '시스템', en: 'System', ja: 'システム' },
  themeDesc: { ko: '기기의 설정(낮/밤)을 자동으로 따릅니다.', en: 'Automatically follows your device settings.', ja: 'デバイスの設定（昼/夜）に自動的に従います。' },
  workHoursTitle: { ko: '최적 업무 시간 기준', en: 'Optimal Work Hours', ja: '最適な業務時間の基準' },
  workHoursDesc1: { ko: "'최적의 회의 시간' 계산 시 기준이 되는 업무 시간입니다.", en: "Base work hours used for calculating 'Optimal Meeting Time'.", ja: '「最適な会議時間」を計算する際の基準となる業務時間です。' },
  workHoursDesc2: { ko: "(설정 시간 기준 전 2시간, 후 4시간은 연장 업무 시간으로 계산)", en: "(2 hrs before and 4 hrs after are considered extended work hours)", ja: '(設定時間の前後2時間と4時間は延長業務時間として計算されます)' },
  meetingCriteria: { ko: '회의 추천 기준', en: 'Meeting Criteria', ja: '会議の推奨基準' },
  criteriaStrict: { ko: '정규 업무시간 엄수', en: 'Strict Work Hours', ja: '定時業務時間のみ' },
  criteriaStrictDesc: { ko: '모든 참석자의 정규 업무시간을 최우선으로 찾습니다.', en: 'Prioritizes times within regular work hours for everyone.', ja: '全員の定時業務時間内を最優先に検索します。' },
  criteriaFlex: { ko: '유연한 타협 (권장)', en: 'Flexible (Recommended)', ja: '柔軟な対応 (推奨)' },
  criteriaFlexDesc: { ko: '부득이한 경우 연장 업무시간을 일부 허용합니다.', en: 'Allows some extended work hours if necessary.', ja: 'やむを得ない場合は延長業務時間を一部許可します。' },
  criteriaAwake: { ko: '수면 시간만 피하기', en: 'Avoid Sleep Hours', ja: '睡眠時間を避ける' },
  criteriaAwakeDesc: { ko: '야근이나 새벽 시간이라도 잠자는 시간만 피해서 찾습니다.', en: 'Finds any awake hours, regardless of extended or early hours.', ja: '深夜や早朝でも、睡眠時間のみを避けて検索します。' },
  language: { ko: '언어 설정', en: 'Language', ja: '言語設定' },
  globalAlarmDefault: { ko: '알람', en: 'Alarm', ja: 'アラーム' },
  
  // === PRO 버전 관련 다국어 ===
  proUpgrade: { ko: 'Pro 버전 업그레이드', en: 'Upgrade to Pro', ja: 'Proバージョンにアップグレード' },
  limitCity: { ko: '무료 버전은 최대 4개의 도시만 추가할 수 있습니다.', en: 'Free version allows up to 4 cities.', ja: '無料版では最大4つの都市まで追加できます。' },
  limitList: { ko: '무료 버전은 1개의 묶음만 저장할 수 있습니다.', en: 'Free version allows 1 saved list.', ja: '無料版では1つのリストのみ保存できます。' },
  limitAlarm: { ko: '무료 버전은 최대 2개의 알람만 설정할 수 있습니다.', en: 'Free version allows up to 2 alarms.', ja: '無料版では最大2つのアラームのみ設定できます。' },
  limitPremium: { ko: 'Pro 버전 전용 프리미엄 기능입니다.', en: 'This is a premium Pro feature.', ja: 'これはPro専用のプレミアム機能です。' },
  proFeature1: { ko: '🌍 무제한 도시 및 저장 리스트', en: '🌍 Unlimited cities and lists', ja: '🌍 無制限の都市と保存リスト' },
  proFeature2: { ko: '⏰ 무제한 글로벌 알람 설정', en: '⏰ Unlimited global alarms', ja: '⏰ 無制限のグローバルアラーム' },
  proFeature3: { ko: '🔀 시간대 합치기 및 그리드 뷰', en: '🔀 Merge timezones & Grid view', ja: '🔀 タイムゾーン結合とグリッドビュー' },
  proFeature4: { ko: '👔 고급 회의 조건 및 프리미엄 사운드', en: '👔 Advanced meeting criteria & sounds', ja: '👔 高度な会議条件とプレミアムサウンド' },
  proFeature5: { ko: '🚫 거슬리는 하단 광고 제거', en: '🚫 Ad-free experience', ja: '🚫 広告なしの快適な体験' },
  buyPro: { ko: '평생 소장 ($4.99)', en: 'Lifetime Access ($4.99)', ja: '永久アクセス ($4.99)' },
  restore: { ko: '구매 내역 복원', en: 'Restore Purchase', ja: '購入の復元' },
  alreadyPro: { ko: 'Pro 버전 사용 중입니다 ✨', en: 'You are using Pro version ✨', ja: 'Proバージョンをご利用中です ✨' },
  unlockAll: { ko: '모든 프리미엄 기능 해제', en: 'Unlock all premium features', ja: 'すべてのプレミアム機能を解放' }
};

// === 도시 데이터 ===
const ALL_CITIES = [
  // --- 아시아 (Asia) ---
  { id: 'seoul', name: { ko: '서울', en: 'Seoul', ja: 'ソウル' }, country: { ko: '대한민국', en: 'South Korea', ja: '韓国' }, tz: 'Asia/Seoul', flag: '🇰🇷' },
  { id: 'busan', name: { ko: '부산', en: 'Busan', ja: '釜山' }, country: { ko: '대한민국', en: 'South Korea', ja: '韓国' }, tz: 'Asia/Seoul', flag: '🇰🇷' },
  { id: 'tokyo', name: { ko: '도쿄', en: 'Tokyo', ja: '東京' }, country: { ko: '일본', en: 'Japan', ja: '日本' }, tz: 'Asia/Tokyo', flag: '🇯🇵' },
  { id: 'osaka', name: { ko: '오사카', en: 'Osaka', ja: '大阪' }, country: { ko: '일본', en: 'Japan', ja: '日本' }, tz: 'Asia/Tokyo', flag: '🇯🇵' },
  { id: 'kyoto', name: { ko: '교토', en: 'Kyoto', ja: '京都' }, country: { ko: '일본', en: 'Japan', ja: '日本' }, tz: 'Asia/Tokyo', flag: '🇯🇵' },
  { id: 'beijing', name: { ko: '베이징', en: 'Beijing', ja: '北京' }, country: { ko: '중국', en: 'China', ja: '中国' }, tz: 'Asia/Shanghai', flag: '🇨🇳' },
  { id: 'shanghai', name: { ko: '상하이', en: 'Shanghai', ja: '上海' }, country: { ko: '중국', en: 'China', ja: '中国' }, tz: 'Asia/Shanghai', flag: '🇨🇳' },
  { id: 'guangzhou', name: { ko: '광저우', en: 'Guangzhou', ja: '広州' }, country: { ko: '중국', en: 'China', ja: '中国' }, tz: 'Asia/Shanghai', flag: '🇨🇳' },
  { id: 'shenzhen', name: { ko: '선전', en: 'Shenzhen', ja: '深セン' }, country: { ko: '중국', en: 'China', ja: '中国' }, tz: 'Asia/Shanghai', flag: '🇨🇳' },
  { id: 'hongkong', name: { ko: '홍콩', en: 'Hong Kong', ja: '香港' }, country: { ko: '홍콩', en: 'Hong Kong', ja: '香港' }, tz: 'Asia/Hong_Kong', flag: '🇭🇰' },
  { id: 'macau', name: { ko: '마카오', en: 'Macau', ja: 'マカオ' }, country: { ko: '마카오', en: 'Macau', ja: 'マカオ' }, tz: 'Asia/Macau', flag: '🇲🇴' },
  { id: 'taipei', name: { ko: '타이베이', en: 'Taipei', ja: '台北' }, country: { ko: '대만', en: 'Taiwan', ja: '台湾' }, tz: 'Asia/Taipei', flag: '🇹🇼' },
  { id: 'bangkok', name: { ko: '방콕', en: 'Bangkok', ja: 'バンコク' }, country: { ko: '태국', en: 'Thailand', ja: 'タイ' }, tz: 'Asia/Bangkok', flag: '🇹🇭' },
  { id: 'singapore', name: { ko: '싱가포르', en: 'Singapore', ja: 'シンガポール' }, country: { ko: '싱가포르', en: 'Singapore', ja: 'シンガポール' }, tz: 'Asia/Singapore', flag: '🇸🇬' },
  { id: 'kuala_lumpur', name: { ko: '쿠알라룸푸르', en: 'Kuala Lumpur', ja: 'クアラルンプール' }, country: { ko: '말레이시아', en: 'Malaysia', ja: 'マレーシア' }, tz: 'Asia/Kuala_Lumpur', flag: '🇲🇾' },
  { id: 'jakarta', name: { ko: '자카르타', en: 'Jakarta', ja: 'ジャカルタ' }, country: { ko: '인도네시아', en: 'Indonesia', ja: 'インドネシア' }, tz: 'Asia/Jakarta', flag: '🇮🇩' },
  { id: 'manila', name: { ko: '마닐라', en: 'Manila', ja: 'マニラ' }, country: { ko: '필리핀', en: 'Philippines', ja: 'フィリピン' }, tz: 'Asia/Manila', flag: '🇵🇭' },
  { id: 'hanoi', name: { ko: '하노이', en: 'Hanoi', ja: 'ハノイ' }, country: { ko: '베트남', en: 'Vietnam', ja: 'ベトナム' }, tz: 'Asia/Ho_Chi_Minh', flag: '🇻🇳' },
  { id: 'ho_chi_minh', name: { ko: '호치민', en: 'Ho Chi Minh', ja: 'ホーチミン' }, country: { ko: '베트남', en: 'Vietnam', ja: 'ベトナム' }, tz: 'Asia/Ho_Chi_Minh', flag: '🇻🇳' },
  { id: 'new_delhi', name: { ko: '뉴델리', en: 'New Delhi', ja: 'ニューデリー' }, country: { ko: '인도', en: 'India', ja: 'インド' }, tz: 'Asia/Kolkata', flag: '🇮🇳' },
  { id: 'mumbai', name: { ko: '뭄바이', en: 'Mumbai', ja: 'ムンバイ' }, country: { ko: '인도', en: 'India', ja: 'インド' }, tz: 'Asia/Kolkata', flag: '🇮🇳' },
  { id: 'bangalore', name: { ko: '방갈로르', en: 'Bangalore', ja: 'バンガロール' }, country: { ko: '인도', en: 'India', ja: 'インド' }, tz: 'Asia/Kolkata', flag: '🇮🇳' },
  { id: 'riyadh', name: { ko: '리야드', en: 'Riyadh', ja: 'リヤド' }, country: { ko: '사우디아라비아', en: 'Saudi Arabia', ja: 'サウジアラビア' }, tz: 'Asia/Riyadh', flag: '🇸🇦' },
  { id: 'dubai', name: { ko: '두바이', en: 'Dubai', ja: 'ドバイ' }, country: { ko: '아랍에미리트', en: 'UAE', ja: 'アラブ首長国連邦' }, tz: 'Asia/Dubai', flag: '🇦🇪' },
  { id: 'abu_dhabi', name: { ko: '아부다비', en: 'Abu Dhabi', ja: 'アブダビ' }, country: { ko: '아랍에미리트', en: 'UAE', ja: 'アラブ首長国連邦' }, tz: 'Asia/Dubai', flag: '🇦🇪' },
  { id: 'doha', name: { ko: '도하', en: 'Doha', ja: 'ドーハ' }, country: { ko: '카타르', en: 'Qatar', ja: 'カタール' }, tz: 'Asia/Qatar', flag: '🇶🇦' },
  { id: 'kuwait_city', name: { ko: '쿠웨이트시티', en: 'Kuwait City', ja: 'クウェートシティ' }, country: { ko: '쿠웨이트', en: 'Kuwait', ja: 'クウェート' }, tz: 'Asia/Kuwait', flag: '🇰🇼' },
  { id: 'tehran', name: { ko: '테헤란', en: 'Tehran', ja: 'テヘラン' }, country: { ko: '이란', en: 'Iran', ja: 'イラン' }, tz: 'Asia/Tehran', flag: '🇮🇷' },
  { id: 'tel_aviv', name: { ko: '텔아비브', en: 'Tel Aviv', ja: 'テルアビブ' }, country: { ko: '이스라엘', en: 'Israel', ja: 'イスラエル' }, tz: 'Asia/Jerusalem', flag: '🇮🇱' },
  { id: 'jerusalem', name: { ko: '예루살렘', en: 'Jerusalem', ja: 'エルサレム' }, country: { ko: '이스라엘', en: 'Israel', ja: 'イスラエル' }, tz: 'Asia/Jerusalem', flag: '🇮🇱' },
  
  // --- 북아메리카 (North America) ---
  { id: 'newyork', name: { ko: '뉴욕', en: 'New York', ja: 'ニューヨーク' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/New_York', flag: '🇺🇸' },
  { id: 'washington_dc', name: { ko: '워싱턴 D.C.', en: 'Washington D.C.', ja: 'ワシントン D.C.' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/New_York', flag: '🇺🇸' },
  { id: 'miami', name: { ko: '마이애미', en: 'Miami', ja: 'マイアミ' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/New_York', flag: '🇺🇸' },
  { id: 'boston', name: { ko: '보스턴', en: 'Boston', ja: 'ボストン' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/New_York', flag: '🇺🇸' },
  { id: 'atlanta', name: { ko: '애틀랜타', en: 'Atlanta', ja: 'アトランタ' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/New_York', flag: '🇺🇸' },
  { id: 'chicago', name: { ko: '시카고', en: 'Chicago', ja: 'シカゴ' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/Chicago', flag: '🇺🇸' },
  { id: 'austin', name: { ko: '오스틴', en: 'Austin', ja: 'オースティン' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/Chicago', flag: '🇺🇸' },
  { id: 'dallas', name: { ko: '댈러스', en: 'Dallas', ja: 'ダラス' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/Chicago', flag: '🇺🇸' },
  { id: 'houston', name: { ko: '휴스턴', en: 'Houston', ja: 'ヒューストン' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/Chicago', flag: '🇺🇸' },
  { id: 'denver', name: { ko: '덴버', en: 'Denver', ja: 'デンバー' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/Denver', flag: '🇺🇸' },
  { id: 'phoenix', name: { ko: '피닉스', en: 'Phoenix', ja: 'フェニックス' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/Phoenix', flag: '🇺🇸' },
  { id: 'losangeles', name: { ko: 'LA', en: 'Los Angeles', ja: 'ロサンゼルス' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/Los_Angeles', flag: '🇺🇸' },
  { id: 'sanfrancisco', name: { ko: '샌프란시스코', en: 'San Francisco', ja: 'サンフランシスコ' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/Los_Angeles', flag: '🇺🇸' },
  { id: 'seattle', name: { ko: '시애틀', en: 'Seattle', ja: 'シアトル' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/Los_Angeles', flag: '🇺🇸' },
  { id: 'lasvegas', name: { ko: '라스베이거스', en: 'Las Vegas', ja: 'ラスベガス' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/Los_Angeles', flag: '🇺🇸' },
  { id: 'anchorage', name: { ko: '앵커리지', en: 'Anchorage', ja: 'アンカレッジ' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'America/Anchorage', flag: '🇺🇸' },
  { id: 'honolulu', name: { ko: '호놀룰루', en: 'Honolulu', ja: 'ホノルル' }, country: { ko: '미국', en: 'USA', ja: '米国' }, tz: 'Pacific/Honolulu', flag: '🇺🇸' },
  { id: 'toronto', name: { ko: '토론토', en: 'Toronto', ja: 'トロント' }, country: { ko: '캐나다', en: 'Canada', ja: 'カナダ' }, tz: 'America/Toronto', flag: '🇨🇦' },
  { id: 'montreal', name: { ko: '몬트리올', en: 'Montreal', ja: 'モントリオール' }, country: { ko: '캐나다', en: 'Canada', ja: 'カナダ' }, tz: 'America/Toronto', flag: '🇨🇦' },
  { id: 'vancouver', name: { ko: '밴쿠버', en: 'Vancouver', ja: 'バンクーバー' }, country: { ko: '캐나다', en: 'Canada', ja: 'カナダ' }, tz: 'America/Vancouver', flag: '🇨🇦' },
  { id: 'calgary', name: { ko: '캘거리', en: 'Calgary', ja: 'カルガリー' }, country: { ko: '캐나다', en: 'Canada', ja: 'カナダ' }, tz: 'America/Edmonton', flag: '🇨🇦' },
  { id: 'mexico_city', name: { ko: '멕시코시티', en: 'Mexico City', ja: 'メキシコシティ' }, country: { ko: '멕시코', en: 'Mexico', ja: 'メキシコ' }, tz: 'America/Mexico_City', flag: '🇲🇽' },
  { id: 'havana', name: { ko: '아바나', en: 'Havana', ja: 'ハバナ' }, country: { ko: '쿠바', en: 'Cuba', ja: 'キューバ' }, tz: 'America/Havana', flag: '🇨🇺' },

  // --- 남아메리카 (South America) ---
  { id: 'sao_paulo', name: { ko: '상파울루', en: 'Sao Paulo', ja: 'サンパウロ' }, country: { ko: '브라질', en: 'Brazil', ja: 'ブラジル' }, tz: 'America/Sao_Paulo', flag: '🇧🇷' },
  { id: 'rio_de_janeiro', name: { ko: '리우데자네이루', en: 'Rio de Janeiro', ja: 'リオデジャネイロ' }, country: { ko: '브라질', en: 'Brazil', ja: 'ブラジル' }, tz: 'America/Sao_Paulo', flag: '🇧🇷' },
  { id: 'buenos_aires', name: { ko: '부에노스아이레스', en: 'Buenos Aires', ja: 'ブエノスアイレス' }, country: { ko: '아르헨티나', en: 'Argentina', ja: 'アルゼンチン' }, tz: 'America/Argentina/Buenos_Aires', flag: '🇦🇷' },
  { id: 'santiago', name: { ko: '산티아고', en: 'Santiago', ja: 'サンティアゴ' }, country: { ko: '칠레', en: 'Chile', ja: 'チリ' }, tz: 'America/Santiago', flag: '🇨🇱' },
  { id: 'bogota', name: { ko: '보고타', en: 'Bogota', ja: 'ボゴタ' }, country: { ko: '콜롬비아', en: 'Colombia', ja: 'コロンビア' }, tz: 'America/Bogota', flag: '🇨🇴' },
  { id: 'lima', name: { ko: '리마', en: 'Lima', ja: 'リマ' }, country: { ko: '페루', en: 'Peru', ja: 'ペルー' }, tz: 'America/Lima', flag: '🇵🇪' },
  { id: 'caracas', name: { ko: '카라카스', en: 'Caracas', ja: 'カラカス' }, country: { ko: '베네수엘라', en: 'Venezuela', ja: 'ベネズエラ' }, tz: 'America/Caracas', flag: '🇻🇪' },

  // --- 유럽 (Europe) ---
  { id: 'london', name: { ko: '런던', en: 'London', ja: 'ロンドン' }, country: { ko: '영국', en: 'UK', ja: 'イギリス' }, tz: 'Europe/London', flag: '🇬🇧' },
  { id: 'paris', name: { ko: '파리', en: 'Paris', ja: 'パリ' }, country: { ko: '프랑스', en: 'France', ja: 'フランス' }, tz: 'Europe/Paris', flag: '🇫🇷' },
  { id: 'berlin', name: { ko: '베를린', en: 'Berlin', ja: 'ベルリン' }, country: { ko: '독일', en: 'Germany', ja: 'ドイツ' }, tz: 'Europe/Berlin', flag: '🇩🇪' },
  { id: 'rome', name: { ko: '로마', en: 'Rome', ja: 'ローマ' }, country: { ko: '이탈리아', en: 'Italy', ja: 'イタリア' }, tz: 'Europe/Rome', flag: '🇮🇹' },
  { id: 'madrid', name: { ko: '마드리드', en: 'Madrid', ja: 'マドリード' }, country: { ko: '스페인', en: 'Spain', ja: 'スペイン' }, tz: 'Europe/Madrid', flag: '🇪🇸' },
  { id: 'amsterdam', name: { ko: '암스테르담', en: 'Amsterdam', ja: 'アムステルダム' }, country: { ko: '네덜란드', en: 'Netherlands', ja: 'オランダ' }, tz: 'Europe/Amsterdam', flag: '🇳🇱' },
  { id: 'zurich', name: { ko: '취리히', en: 'Zurich', ja: 'チューリッヒ' }, country: { ko: '스위스', en: 'Switzerland', ja: 'スイス' }, tz: 'Europe/Zurich', flag: '🇨🇭' },
  { id: 'geneva', name: { ko: '제네바', en: 'Geneva', ja: 'ジュネーブ' }, country: { ko: '스위스', en: 'Switzerland', ja: 'スイス' }, tz: 'Europe/Zurich', flag: '🇨🇭' },
  { id: 'vienna', name: { ko: '빈', en: 'Vienna', ja: 'ウィーン' }, country: { ko: '오스트리아', en: 'Austria', ja: 'オーストリア' }, tz: 'Europe/Vienna', flag: '🇦🇹' },
  { id: 'prague', name: { ko: '프라하', en: 'Prague', ja: 'プラハ' }, country: { ko: '체코', en: 'Czechia', ja: 'チェコ' }, tz: 'Europe/Prague', flag: '🇨🇿' },
  { id: 'warsaw', name: { ko: '바르샤바', en: 'Warsaw', ja: 'ワルシャワ' }, country: { ko: '폴란드', en: 'Poland', ja: 'ポーランド' }, tz: 'Europe/Warsaw', flag: '🇵🇱' },
  { id: 'budapest', name: { ko: '부다페스트', en: 'Budapest', ja: 'ブダペスト' }, country: { ko: '헝가리', en: 'Hungary', ja: 'ハンガリー' }, tz: 'Europe/Budapest', flag: '🇭🇺' },
  { id: 'athens', name: { ko: '아테네', en: 'Athens', ja: 'アテネ' }, country: { ko: '그리스', en: 'Greece', ja: 'ギリシャ' }, tz: 'Europe/Athens', flag: '🇬🇷' },
  { id: 'dublin', name: { ko: '더블린', en: 'Dublin', ja: 'ダブリン' }, country: { ko: '아일랜드', en: 'Ireland', ja: 'アイルランド' }, tz: 'Europe/Dublin', flag: '🇮🇪' },
  { id: 'brussels', name: { ko: '브뤼셀', en: 'Brussels', ja: 'ブリュッセル' }, country: { ko: '벨기에', en: 'Belgium', ja: 'ベルギー' }, tz: 'Europe/Brussels', flag: '🇧🇪' },
  { id: 'stockholm', name: { ko: '스톡홀름', en: 'Stockholm', ja: 'ストックホルム' }, country: { ko: '스웨덴', en: 'Sweden', ja: 'スウェーデン' }, tz: 'Europe/Stockholm', flag: '🇸🇪' },
  { id: 'copenhagen', name: { ko: '코펜하겐', en: 'Copenhagen', ja: 'コペンハーゲン' }, country: { ko: '덴마크', en: 'Denmark', ja: 'デンマーク' }, tz: 'Europe/Copenhagen', flag: '🇩🇰' },
  { id: 'oslo', name: { ko: '오슬로', en: 'Oslo', ja: 'オスロ' }, country: { ko: '노르웨이', en: 'Norway', ja: 'ノルウェー' }, tz: 'Europe/Oslo', flag: '🇳🇴' },
  { id: 'helsinki', name: { ko: '헬싱키', en: 'Helsinki', ja: 'ヘルシンキ' }, country: { ko: '핀란드', en: 'Finland', ja: 'フィンランド' }, tz: 'Europe/Helsinki', flag: '🇫🇮' },
  { id: 'lisbon', name: { ko: '리스본', en: 'Lisbon', ja: 'リスボン' }, country: { ko: '포르투갈', en: 'Portugal', ja: 'ポルトガル' }, tz: 'Europe/Lisbon', flag: '🇵🇹' },
  { id: 'kyiv', name: { ko: '키이우', en: 'Kyiv', ja: 'キーウ' }, country: { ko: '우크라이나', en: 'Ukraine', ja: 'ウクライナ' }, tz: 'Europe/Kyiv', flag: '🇺🇦' },
  { id: 'bucharest', name: { ko: '부쿠레슈티', en: 'Bucharest', ja: 'ブカレスト' }, country: { ko: '루마니아', en: 'Romania', ja: 'ルーマニア' }, tz: 'Europe/Bucharest', flag: '🇷🇴' },
  { id: 'moscow', name: { ko: '모스크바', en: 'Moscow', ja: 'モスクワ' }, country: { ko: '러시아', en: 'Russia', ja: 'ロシア' }, tz: 'Europe/Moscow', flag: '🇷🇺' },
  { id: 'istanbul', name: { ko: '이스탄불', en: 'Istanbul', ja: 'イスタンブール' }, country: { ko: '튀르키예', en: 'Turkey', ja: 'トルコ' }, tz: 'Europe/Istanbul', flag: '🇹🇷' },

  // --- 오세아니아 (Oceania) ---
  { id: 'sydney', name: { ko: '시드니', en: 'Sydney', ja: 'シドニー' }, country: { ko: '호주', en: 'Australia', ja: 'オーストラリア' }, tz: 'Australia/Sydney', flag: '🇦🇺' },
  { id: 'melbourne', name: { ko: '멜버른', en: 'Melbourne', ja: 'メルボルン' }, country: { ko: '호주', en: 'Australia', ja: 'オーストラリア' }, tz: 'Australia/Melbourne', flag: '🇦🇺' },
  { id: 'brisbane', name: { ko: '브리즈번', en: 'Brisbane', ja: 'ブリスベン' }, country: { ko: '호주', en: 'Australia', ja: 'オーストラリア' }, tz: 'Australia/Brisbane', flag: '🇦🇺' },
  { id: 'perth', name: { ko: '퍼스', en: 'Perth', ja: 'パース' }, country: { ko: '호주', en: 'Australia', ja: 'オーストラリア' }, tz: 'Australia/Perth', flag: '🇦🇺' },
  { id: 'auckland', name: { ko: '오클랜드', en: 'Auckland', ja: 'オークランド' }, country: { ko: '뉴질랜드', en: 'New Zealand', ja: 'ニュージーランド' }, tz: 'Pacific/Auckland', flag: '🇳🇿' },
  { id: 'wellington', name: { ko: '웰링턴', en: 'Wellington', ja: 'ウェリントン' }, country: { ko: '뉴질랜드', en: 'New Zealand', ja: 'ニュージーランド' }, tz: 'Pacific/Auckland', flag: '🇳🇿' },
  { id: 'fiji', name: { ko: '피지', en: 'Fiji', ja: 'フィジー' }, country: { ko: '피지', en: 'Fiji', ja: 'フィジー' }, tz: 'Pacific/Fiji', flag: '🇫🇯' },

  // --- 아프리카 (Africa) ---
  { id: 'cairo', name: { ko: '카이로', en: 'Cairo', ja: 'カイロ' }, country: { ko: '이집트', en: 'Egypt', ja: 'エジプト' }, tz: 'Africa/Cairo', flag: '🇪🇬' },
  { id: 'cape_town', name: { ko: '케이프타운', en: 'Cape Town', ja: 'ケープタウン' }, country: { ko: '남아프리카 공화국', en: 'South Africa', ja: '南アフリカ' }, tz: 'Africa/Johannesburg', flag: '🇿🇦' },
  { id: 'johannesburg', name: { ko: '요하네스버그', en: 'Johannesburg', ja: 'ヨハネスブルグ' }, country: { ko: '남아프리카 공화국', en: 'South Africa', ja: '南アフリカ' }, tz: 'Africa/Johannesburg', flag: '🇿🇦' },
  { id: 'nairobi', name: { ko: '나이로비', en: 'Nairobi', ja: 'ナイロビ' }, country: { ko: '케냐', en: 'Kenya', ja: 'ケニア' }, tz: 'Africa/Nairobi', flag: '🇰🇪' },
  { id: 'lagos', name: { ko: '라고스', en: 'Lagos', ja: 'ラゴス' }, country: { ko: '나이지리아', en: 'Nigeria', ja: 'ナイジェリア' }, tz: 'Africa/Lagos', flag: '🇳🇬' },
  { id: 'casablanca', name: { ko: '카사블랑카', en: 'Casablanca', ja: 'カサブランカ' }, country: { ko: '모로코', en: 'Morocco', ja: 'モロッコ' }, tz: 'Africa/Casablanca', flag: '🇲🇦' }
];

const ALARM_SOUNDS = [
  { id: 'radar', name: { ko: '전파 탐지기 (기본)', en: 'Radar (Default)', ja: 'レーダー (デフォルト)' } },
  { id: 'apex', name: { ko: '정점', en: 'Apex', ja: '頂点' } },
  { id: 'beacon', name: { ko: '신호', en: 'Beacon', ja: 'ビーコン' } },
  { id: 'circuit', name: { ko: '회로', en: 'Circuit', ja: '回路' } },
  { id: 'constellation', name: { ko: '별자리', en: 'Constellation', ja: '星座' } },
  { id: 'cosmic', name: { ko: '우주', en: 'Cosmic', ja: '宇宙' } },
  { id: 'crystals', name: { ko: '크리스탈', en: 'Crystals', ja: 'クリスタル' } },
  { id: 'waves', name: { ko: '파도', en: 'Waves', ja: '波' } }
];

const getZonedDateTime = (localStr, timeZone) => {
  if (!localStr) return new Date();
  const localTarget = new Date(localStr);
  let timestamp = localTarget.getTime();
  const getTzStr = (ts) => {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(new Date(ts));
    const obj = {}; parts.forEach(p => obj[p.type] = p.value);
    return `${obj.year}-${obj.month}-${obj.day}T${obj.hour === '24' ? '00' : obj.hour}:${obj.minute}`;
  };
  const guessLocal = new Date(getTzStr(timestamp));
  timestamp += (localTarget.getTime() - guessLocal.getTime());
  for (let i = 0; i < 3; i++) {
    const currentStr = getTzStr(timestamp);
    if (currentStr.substring(0, 16) === localStr) break;
    timestamp += (localTarget.getTime() - new Date(currentStr).getTime());
  }
  return new Date(timestamp);
};

const getLocalDatetimeString = (date, timeZone) => {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(date);
    const obj = {}; parts.forEach(p => obj[p.type] = p.value);
    const hour = obj.hour === '24' ? '00' : obj.hour;
    return `${obj.year}-${obj.month}-${obj.day}T${hour}:${obj.minute}`;
  } catch (e) { return ''; }
};

const formatCustomDateTimeDisplay = (dtStr, lang) => {
  if (!dtStr) return '';
  try {
    const d = new Date(dtStr);
    if (lang === 'en') return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).format(d);
    if (lang === 'ja') return new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).format(d);
    return new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true }).format(d);
  } catch (e) { return dtStr; }
};

export default function App() {
  const [realTime, setRealTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('worldclock');

  // === 유료 결제 (Pro) 상태 ===
  const [isPro, setIsPro] = useState(false);
  const [paywallReason, setPaywallReason] = useState(null);

  // === 앱 설정 상태 ===
  const [theme, setTheme] = useState('system');
  const [systemIsDark, setSystemIsDark] = useState(false);
  const [appLang, setAppLang] = useState('system');
  const [isAppConfigModalOpen, setIsAppConfigModalOpen] = useState(false);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        const { display } = await LocalNotifications.requestPermissions();
        if (display !== 'granted') {
          console.warn('알림 권한이 거부되었습니다.');
        }
      } catch (e) {
        console.error('권한 요청 중 오류 발생:', e);
      }
      try {
        const { exactAlarm } = await LocalNotifications.checkPermissions();
        if (exactAlarm === 'prompt' || exactAlarm === 'denied') {
          await LocalNotifications.requestPermissions();
        }
      } catch (e) {}
    };
    requestNotificationPermission();
 const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mq.matches);
    const listener = (e) => setSystemIsDark(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  const isDark = theme === 'dark' || (theme === 'system' && systemIsDark);

  const currentLang = useMemo(() => {
    if (appLang !== 'system') return appLang;
    const navLang = navigator.language || navigator.userLanguage;
    if (navLang.startsWith('ko')) return 'ko';
    if (navLang.startsWith('ja')) return 'ja';
    return 'en';
  }, [appLang]);

  const t = (key) => UI[key]?.[currentLang] || key;
  const localeMap = { ko: 'ko-KR', en: 'en-US', ja: 'ja-JP' };

  const paywallMessages = { city: t('limitCity'), list: t('limitList'), alarm: t('limitAlarm'), premium: t('limitPremium') };

  // === 세계 시계 상태 ===
  const [customBaseTime, setCustomBaseTime] = useState('');
  const [myCities, setMyCities] = useState(() => {
    return ALL_CITIES.filter(city => ['seoul', 'tokyo', 'newyork', 'london'].includes(city.id));
  });
  const [baseCityId, setBaseCityId] = useState('seoul');
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  const [isMergedMode, setIsMergedMode] = useState(false);
  const [isTimeEditModalOpen, setIsTimeEditModalOpen] = useState(false);

  // === 터치 이동(Drag) 지연 관련 Ref ===
  const cityDragTimer = useRef(null);
  const alarmDragTimer = useRef(null);

  const [draggedCityIdx, setDraggedCityIdx] = useState(null);
  const [cityTouchY, setCityTouchY] = useState(0);

  // === 회의 시간 및 업무 설정 상태 ===
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [workHours, setWorkHours] = useState({ start: 9, end: 18 });
  const [meetingCriteria, setMeetingCriteria] = useState('flexible');

  // === 저장 리스트 상태 ===
  const [savedLists, setSavedLists] = useState([
    { id: 'list-1', name: 'Global Team A', cityIds: ['seoul', 'newyork', 'london'], createdAt: Date.now() - 100000 }
  ]);
  const [isSaveListModalOpen, setIsSaveListModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState('');

  // === 알람 상태 ===
  const [alarms, setAlarms] = useState([
    { id: '1', cityId: 'newyork', targetDatetimeLocal: getLocalDatetimeString(new Date(Date.now() + 86400000), 'America/New_York'), timestamp: Date.now() + 86400000, label: 'Meeting', soundId: 'radar', isEnabled: true }
  ]);
  const [isAlarmEditMode, setIsAlarmEditMode] = useState(false);
  const [isAddAlarmModalOpen, setIsAddAlarmModalOpen] = useState(false);
  const [isSoundSelectModalOpen, setIsSoundSelectModalOpen] = useState(false);
  const [editingAlarmId, setEditingAlarmId] = useState(null);
  const [alarmDisplayMode, setAlarmDisplayMode] = useState('target');
  
  const [newAlarmCityId, setNewAlarmCityId] = useState('seoul');
  const [newAlarmDatetime, setNewAlarmDatetime] = useState('');
  const [newAlarmLabel, setNewAlarmLabel] = useState('Alarm');
  const [newAlarmSound, setNewAlarmSound] = useState('radar');
  const [draggedAlarmIdx, setDraggedAlarmIdx] = useState(null);
  const [alarmTouchY, setAlarmTouchY] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setRealTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const baseCity = myCities.find(c => c.id === baseCityId) || ALL_CITIES[0];
  let referenceDate = realTime;
  let isCustom = !!customBaseTime;
  if (customBaseTime) referenceDate = getZonedDateTime(customBaseTime, baseCity.tz);

  const handleBaseCityChange = (newCityId) => {
    if (customBaseTime) {
      const newCity = myCities.find(c => c.id === newCityId) || ALL_CITIES.find(c => c.id === newCityId);
      if (newCity) setCustomBaseTime(getLocalDatetimeString(referenceDate, newCity.tz));
    }
    setBaseCityId(newCityId);
    setMyCities(prev => {
      const arr = [...prev]; const idx = arr.findIndex(c => c.id === newCityId);
      if (idx > 0) { const [c] = arr.splice(idx, 1); arr.unshift(c); }
      return arr;
    });
  };

  const formatTimeForZone = (date, timeZone) => {
    try { return new Intl.DateTimeFormat(localeMap[currentLang], { timeZone, hour: 'numeric', minute: '2-digit', hour12: true }).format(date); } catch (e) { return "Error"; }
  };
  const getTzAbbreviation = (date, timeZone) => {
    try { const parts = new Intl.DateTimeFormat('en-US', { timeZone, timeZoneName: 'short' }).formatToParts(date); return parts.find(p => p.type === 'timeZoneName')?.value || ''; } catch (e) { return ''; }
  };
  const formatDateForZone = (date, timeZone) => {
    try { return new Intl.DateTimeFormat(localeMap[currentLang], { timeZone, year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }).format(date); } catch (e) { return "Error"; }
  };

  const getDayDifference = (date, baseTz, targetTz) => {
    try {
      const baseDateStr = new Intl.DateTimeFormat('en-US', { timeZone: baseTz, year: 'numeric', month: 'numeric', day: 'numeric' }).format(date);
      const targetDateStr = new Intl.DateTimeFormat('en-US', { timeZone: targetTz, year: 'numeric', month: 'numeric', day: 'numeric' }).format(date);
      const diffDays = Math.round((new Date(targetDateStr) - new Date(baseDateStr)) / 86400000); 
      if (diffDays === 0) return { status: 'today', text: { ko: '오늘', en: 'Today', ja: '今日' }[currentLang] };
      if (diffDays === 1) return { status: 'future', text: { ko: '내일', en: 'Tomorrow', ja: '明日' }[currentLang] };
      if (diffDays === -1) return { status: 'past', text: { ko: '어제', en: 'Yesterday', ja: '昨日' }[currentLang] };
      if (diffDays > 1) return { status: 'future', text: { ko: `${diffDays}일 뒤`, en: `In ${diffDays} days`, ja: `${diffDays}日後` }[currentLang] };
      return { status: 'past', text: { ko: `${Math.abs(diffDays)}일 전`, en: `${Math.abs(diffDays)} days ago`, ja: `${Math.abs(diffDays)}日前` }[currentLang] };
    } catch (e) { return { status: 'today', text: '' }; }
  };

  const getHourDifferenceStr = (targetTz, baseTz, date) => {
    try {
      const getOffsetMs = (tz) => {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(date);
        const obj = {}; parts.forEach(p => obj[p.type] = p.value);
        return new Date(parseInt(obj.year), parseInt(obj.month)-1, parseInt(obj.day), obj.hour === '24' ? 0 : parseInt(obj.hour, 10), parseInt(obj.minute)).getTime();
      };
      const diffHours = (getOffsetMs(targetTz) - getOffsetMs(baseTz)) / 3600000;
      if (diffHours === 0) return '';
      const sign = diffHours > 0 ? '+' : '';
      const hrText = { ko: '시간', en: 'h', ja: '時間' }[currentLang];
      const minText = { ko: '분', en: 'm', ja: '分' }[currentLang];
      if (diffHours % 1 !== 0) {
         const hrs = Math.floor(Math.abs(diffHours)); const mins = Math.round((Math.abs(diffHours) - hrs) * 60);
         return `${diffHours > 0 ? '+' : '-'}${hrs}${hrText} ${mins}${minText}`;
      }
      return `${sign}${diffHours}${hrText}`;
    } catch (e) { return ''; }
  };

React.useEffect(() => {
    // ⭐️ 광고 띄우기를 안전하게 실행하기 위한 함수 ⭐️
    const setupAd = async () => {
      try {
        // 1. 구글 광고 플러그인 준비 운동 (이게 있어야 안 뻗습니다!)
        await AdMob.initialize({});

        const options = {
          adId: 'ca-app-pub-3940256099942544/6300978111', 
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
        };

        // 2. 결제 여부에 따라 광고 지우기 or 띄우기
        if (isPro) {
          await AdMob.removeBanner(); // 결제했으면 지움
        } else {
          await AdMob.showBanner(options); // 안 했으면 띄움
        }
      } catch (error) {
        console.log('광고 실행 중 에러 발생:', error);
      }
    };

    setupAd(); // 만들어둔 함수를 실행!
  }, [isPro]);

  const removeCity = (cityIdStr) => {
    const idsToRemove = cityIdStr.split(',');
    if (idsToRemove.includes(baseCityId)) return;
    setMyCities(prev => prev.filter(c => !idsToRemove.includes(c.id)));
  };

  const handleAddCityClick = () => { if (!isPro && myCities.length >= 4) { setPaywallReason('city'); return; } setIsAddingMode(true); };
  const addCity = (city) => { if (!myCities.find(c => c.id === city.id)) setMyCities(prev => [...prev, city]); setIsAddingMode(false); setSearchQuery(''); };
  const handleSaveComboClick = () => { if (!isPro && savedLists.length >= 1) { setPaywallReason('list'); return; } setIsSaveListModalOpen(true); };
  const handleMergeClick = () => { if (!isPro) { setPaywallReason('premium'); return; } setIsMergedMode(!isMergedMode); };
  const handleGridClick = () => { if (!isPro) { setPaywallReason('premium'); return; } setViewMode('grid'); };
  const handleAddAlarmClick = () => { if (!isPro && alarms.length >= 2) { setPaywallReason('alarm'); return; } openAddAlarmModal(); };
  const handleCriteriaSelect = (val) => { if (!isPro && val !== 'flexible') { setPaywallReason('premium'); return; } setMeetingCriteria(val); };
  const handleSoundSelect = (sound, index) => { if (!isPro && index >= 2) { setPaywallReason('premium'); return; } playPreviewSound(sound.id); setIsSoundSelectModalOpen(false); };

  const filteredCities = ALL_CITIES.filter(city => {
    const query = searchQuery.toLowerCase();
    return city.name.ko.includes(query) || city.name.en.toLowerCase().includes(query) || city.name.ja.includes(query) || 
           city.country.ko.includes(query) || city.country.en.toLowerCase().includes(query) || city.country.ja.includes(query);
  });

  let processedCities = [...myCities];
  if (isMergedMode) {
    const timeMap = new Map();
    processedCities.forEach(city => {
      const timeKey = getLocalDatetimeString(referenceDate, city.tz);
      if (timeMap.has(timeKey)) timeMap.get(timeKey).push(city); else timeMap.set(timeKey, [city]);
    });
    processedCities = [];
    timeMap.forEach((group) => {
      if (group.length === 1) processedCities.push(group[0]);
      else {
        processedCities.push({
          id: group.map(c => c.id).join(','),
          name: { ko: group.map(c => c.name.ko).join(', '), en: group.map(c => c.name.en).join(', '), ja: group.map(c => c.name.ja).join(', ') },
          country: { ko: Array.from(new Set(group.map(c => c.country.ko))).join(', '), en: Array.from(new Set(group.map(c => c.country.en))).join(', '), ja: Array.from(new Set(group.map(c => c.country.ja))).join(', ') },
          tz: group[0].tz, flag: Array.from(new Set(group.map(c => c.flag))).join(' '), isMerged: true, originalCities: group
        });
      }
    });
  }
  const displayCities = processedCities;

  const handleCityDragStart = (e, index) => { setDraggedCityIdx(index); if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'; };
  const handleCityDragEnter = (e, index) => {
    e.preventDefault(); if (draggedCityIdx === null || draggedCityIdx === index) return;
    const newDisplayCities = [...displayCities];
    const draggedItem = newDisplayCities[draggedCityIdx];
    newDisplayCities.splice(draggedCityIdx, 1); newDisplayCities.splice(index, 0, draggedItem);
    setMyCities(newDisplayCities.flatMap(dc => dc.isMerged ? dc.originalCities : [myCities.find(c => c.id === dc.id)]));
    setDraggedCityIdx(index);
  };
  const handleCityDragEnd = () => setDraggedCityIdx(null);
  
  const handleCityTouchStart = (e, index) => {
    const startY = e.touches[0].clientY;
    cityDragTimer.current = setTimeout(() => {
      setDraggedCityIdx(index);
      setCityTouchY(startY);
      if (window.navigator && window.navigator.vibrate) {
        try { window.navigator.vibrate(40); } catch(err) {}
      }
    }, 150);
  };

  const handleCityTouchMove = (e) => {
    if (draggedCityIdx === null) {
      clearTimeout(cityDragTimer.current);
      return;
    }
    const diff = e.touches[0].clientY - cityTouchY;
    if (diff > 65 && draggedCityIdx < displayCities.length - 1) {
      const newDisplay = [...displayCities]; const tmp = newDisplay[draggedCityIdx]; newDisplay[draggedCityIdx] = newDisplay[draggedCityIdx+1]; newDisplay[draggedCityIdx+1] = tmp;
      setMyCities(newDisplay.flatMap(dc => dc.isMerged ? dc.originalCities : [myCities.find(c => c.id === dc.id)])); setDraggedCityIdx(draggedCityIdx+1); setCityTouchY(e.touches[0].clientY);
    } else if (diff < -65 && draggedCityIdx > 0) {
      const newDisplay = [...displayCities]; const tmp = newDisplay[draggedCityIdx]; newDisplay[draggedCityIdx] = newDisplay[draggedCityIdx-1]; newDisplay[draggedCityIdx-1] = tmp;
      setMyCities(newDisplay.flatMap(dc => dc.isMerged ? dc.originalCities : [myCities.find(c => c.id === dc.id)])); setDraggedCityIdx(draggedCityIdx-1); setCityTouchY(e.touches[0].clientY);
    }
  };

  const handleCityTouchEnd = () => {
    clearTimeout(cityDragTimer.current);
    setDraggedCityIdx(null);
  };

  const handleAlarmDragStart = (e, index) => { setDraggedAlarmIdx(index); if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'; };
  const handleAlarmDragEnter = (e, index) => {
    e.preventDefault(); if (draggedAlarmIdx === null || draggedAlarmIdx === index) return;
    const newAlarms = [...alarms];
    const draggedItem = newAlarms[draggedAlarmIdx];
    newAlarms.splice(draggedAlarmIdx, 1); newAlarms.splice(index, 0, draggedItem);
    setAlarms(newAlarms); setDraggedAlarmIdx(index);
  };
  const handleAlarmDragEnd = () => setDraggedAlarmIdx(null);

  const handleAlarmTouchStart = (e, index) => {
    const startY = e.touches[0].clientY;
    alarmDragTimer.current = setTimeout(() => {
      setDraggedAlarmIdx(index);
      setAlarmTouchY(startY);
      if (window.navigator && window.navigator.vibrate) {
        try { window.navigator.vibrate(40); } catch(err) {}
      }
    }, 150);
  };

  const handleAlarmTouchMove = (e) => {
    if (draggedAlarmIdx === null) {
      clearTimeout(alarmDragTimer.current);
      return;
    }
    const diff = e.touches[0].clientY - alarmTouchY;
    if (diff > 65 && draggedAlarmIdx < alarms.length - 1) {
      const newAlarms = [...alarms]; const tmp = newAlarms[draggedAlarmIdx]; newAlarms[draggedAlarmIdx] = newAlarms[draggedAlarmIdx+1]; newAlarms[draggedAlarmIdx+1] = tmp;
      setAlarms(newAlarms); setDraggedAlarmIdx(draggedAlarmIdx+1); setAlarmTouchY(e.touches[0].clientY);
    } else if (diff < -65 && draggedAlarmIdx > 0) {
      const newAlarms = [...alarms]; const tmp = newAlarms[draggedAlarmIdx]; newAlarms[draggedAlarmIdx] = newAlarms[draggedAlarmIdx-1]; newAlarms[draggedAlarmIdx-1] = tmp;
      setAlarms(newAlarms); setDraggedAlarmIdx(draggedAlarmIdx-1); setAlarmTouchY(e.touches[0].clientY);
    }
  };

  const handleAlarmTouchEnd = () => {
    clearTimeout(alarmDragTimer.current);
    setDraggedAlarmIdx(null);
  };

  const saveCurrentList = () => {
    if (!newListName.trim() || myCities.length === 0) return;
    setSavedLists([{ id: `list-${Date.now()}`, name: newListName.trim(), cityIds: myCities.map(c => c.id), createdAt: Date.now() }, ...savedLists]);
    setIsSaveListModalOpen(false); setNewListName('');
  };
  
  const loadSavedList = (list) => {
    const loaded = list.cityIds.map(id => ALL_CITIES.find(c => c.id === id)).filter(Boolean);
    if (loaded.length > 0) { setMyCities(loaded); setBaseCityId(loaded[0].id); setActiveTab('worldclock'); }
  };

  const deleteSavedList = (id) => { setSavedLists(savedLists.filter(list => list.id !== id)); };
  const startEditingList = (list) => { setEditingListId(list.id); setEditingListName(list.name); };
  const saveEditedListName = () => { if (editingListName.trim()) { setSavedLists(savedLists.map(list => list.id === editingListId ? { ...list, name: editingListName.trim() } : list)); } setEditingListId(null); };

  const getDeviceLocationName = () => { try { return ALL_CITIES.find(c => c.tz === Intl.DateTimeFormat().resolvedOptions().timeZone)?.country[currentLang] || t('local'); } catch (e) { return t('local'); } };
  const getLocalDeviceEquivalent = (localStr, tz) => { if (!localStr) return ''; try { return new Intl.DateTimeFormat(localeMap[currentLang], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', weekday: 'short' }).format(getZonedDateTime(localStr, tz)); } catch (e) { return ''; } };

  const openAddAlarmModal = () => { setEditingAlarmId(null); setNewAlarmCityId(baseCityId); setNewAlarmDatetime(getLocalDatetimeString(realTime, baseCity.tz)); setNewAlarmLabel(t('globalAlarmDefault')); setNewAlarmSound('radar'); setIsAddAlarmModalOpen(true); };
  const openEditAlarmModal = (alarm) => { setEditingAlarmId(alarm.id); setNewAlarmCityId(alarm.cityId); setNewAlarmDatetime(alarm.targetDatetimeLocal); setNewAlarmLabel(alarm.label); setNewAlarmSound(alarm.soundId || 'radar'); setIsAddAlarmModalOpen(true); };

  const toggleAlarm = async (id) => {
    const targetAlarm = alarms.find(a => a.id === id);
    if (!targetAlarm) return;

    const newIsEnabled = !targetAlarm.isEnabled;

    // React UI 업데이트 (스위치 켜짐/꺼짐 시각적 처리)
    setAlarms(alarms.map(a => a.id === id ? { ...a, isEnabled: newIsEnabled } : a));

    if (newIsEnabled) {
      await scheduleNotification(id, targetAlarm);
    } else {
      try {
        await LocalNotifications.cancel({ notifications: [{ id: parseInt(id, 10) }] });
      } catch (e) {
        console.error('알람 취소 실패:', e);
      }
    }
  };
  const deleteAlarm = (id) => { setAlarms(alarms.filter(a => a.id !== id)); };
  const playPreviewSound = (soundId) => { setNewAlarmSound(soundId); };

  const scheduleNotification = async (alarmId, alarmData) => {
    const fireDate = new Date(alarmData.timestamp);
    if (fireDate <= new Date()) return;
    try {
      await LocalNotifications.schedule({
        notifications: [{
          title: "TimeAlign 알람",
          body: alarmData.label || "설정하신 알람 시간입니다.",
          id: parseInt(alarmId, 10),
          schedule: { at: fireDate, allowWhileIdle: true },
          sound: null,
        }]
      });
    } catch (e) {
      console.error('알람 스케줄 예약 실패:', e);
    }
  };

  const handleSaveNewAlarm = async () => {
    const city = ALL_CITIES.find(c => c.id === newAlarmCityId);
    const absDate = getZonedDateTime(newAlarmDatetime, city.tz);
    const alarmData = { cityId: newAlarmCityId, targetDatetimeLocal: newAlarmDatetime, timestamp: absDate.getTime(), label: newAlarmLabel || t('globalAlarmDefault'), soundId: newAlarmSound, isEnabled: true };
    const alarmId = editingAlarmId || Date.now().toString();
    if (editingAlarmId) {
      try { await LocalNotifications.cancel({ notifications: [{ id: parseInt(editingAlarmId, 10) }] }); } catch (e) {}
      setAlarms(alarms.map(a => a.id === editingAlarmId ? { ...a, ...alarmData } : a));
    } else {
      setAlarms(prev => [...prev, { id: alarmId, ...alarmData }]);
    }
    await scheduleNotification(alarmId, alarmData);
    setIsAddAlarmModalOpen(false); setEditingAlarmId(null);
  };

  // Meeting Logic
  const meetingProposals = useMemo(() => {
    if (!isMeetingModalOpen || myCities.length < 2) return [];
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: baseCity.tz, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(referenceDate);
    const obj = {}; parts.forEach(p => obj[p.type] = p.value);
    const baseMidnight = getZonedDateTime(`${obj.year}-${obj.month}-${obj.day}T00:00`, baseCity.tz).getTime();
    
    const scoredHours = [];
    const workDuration = (workHours.end - workHours.start + 24) % 24 || 24;

    for (let i = 0; i < 24; i++) {
        const ts = baseMidnight + i * 3600000;
        let score = 0; const details = [];
        myCities.forEach(city => {
            const p = new Intl.DateTimeFormat('en-US', { timeZone: city.tz, hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date(ts));
            let hVal = 0, mVal = 0; p.forEach(x => { if(x.type === 'hour') hVal = parseInt(x.value, 10); if(x.type === 'minute') mVal = parseInt(x.value, 10); });
            const h = (hVal === 24 ? 0 : hVal) + mVal / 60;
            let state = 'sleep', cityScore = 0; 
            const diff = (h - workHours.start + 24) % 24;
            if (diff < workDuration) { state = 'work'; cityScore = 10; }
            else if (diff >= 22 || (diff >= workDuration && diff < workDuration + 4)) {
                state = 'extend';
                if (meetingCriteria === 'strict') cityScore = -5; else if (meetingCriteria === 'flexible') cityScore = 5; else cityScore = 10;
            } else {
                state = 'sleep';
                if (meetingCriteria === 'strict') cityScore = -50; else if (meetingCriteria === 'flexible') cityScore = -20; else cityScore = -50;
            }
            score += cityScore; details.push({ city, startHour: h, state });
        });
        scoredHours.push({ ts, hour: i, score, details });
    }
    const groups = []; let currentGroup = null;
    scoredHours.forEach(sh => {
        if (!currentGroup) { currentGroup = { score: sh.score, startHour: sh.hour, endHour: sh.hour, startTs: sh.ts, details: sh.details }; } 
        else if (currentGroup.score === sh.score && currentGroup.endHour === sh.hour - 1) { currentGroup.endHour = sh.hour; } 
        else { groups.push(currentGroup); currentGroup = { score: sh.score, startHour: sh.hour, endHour: sh.hour, startTs: sh.ts, details: sh.details }; }
    });
    if (currentGroup) groups.push(currentGroup);
    return groups.sort((a, b) => b.score - a.score).slice(0, 3);
  }, [isMeetingModalOpen, referenceDate, baseCity.tz, myCities, workHours, meetingCriteria]);

  return (
    <div lang={localeMap[currentLang]} className={`min-h-screen font-sans sm:py-8 overflow-hidden transition-colors duration-300 ${isDark ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`max-w-md mx-auto sm:rounded-3xl sm:shadow-2xl h-screen sm:h-[850px] flex flex-col relative overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
        
        {/* === 1. 세계 시계 탭 === */}
        <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out ${activeTab === 'worldclock' ? 'translate-x-0' : '-translate-x-full'}`}>
          <header className={`bg-slate-800 text-white rounded-b-3xl shadow-md z-20 shrink-0 relative transition-all`}>
            <div className="p-5 flex items-center justify-between cursor-pointer select-none" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
              <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                <div className="w-8 h-8 shrink-0">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <defs>
                      <linearGradient id="grad2-left" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0.8" />
                      </linearGradient>
                      <linearGradient id="grad2-right" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#EA580C" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    <circle cx="38" cy="50" r="30" fill="url(#grad2-left)" style={{ mixBlendMode: 'multiply' }} />
                    <circle cx="62" cy="50" r="30" fill="url(#grad2-right)" style={{ mixBlendMode: 'multiply' }} />
                    <path d="M38 25 L38 30 M38 70 L38 75 M13 50 L18 50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                    <path d="M62 25 L62 30 M62 70 L62 75 M87 50 L82 50" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
                    <circle cx="50" cy="50" r="4" fill="#FFFFFF" />
                  </svg>
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                  {t('globalTime')}
                </span>
              </h1>
              <div className="flex items-center gap-1.5 text-sm text-slate-100 bg-slate-700/80 hover:bg-slate-600 px-3 py-2 rounded-xl transition-colors border border-slate-600">
                <MapPin size={14} className="text-red-400"/><span className="font-semibold">{baseCity.name[currentLang]} {t('baseCity')}</span>
                {isSettingsOpen ? <ChevronUp size={16} className="ml-1 text-slate-400"/> : <ChevronDown size={16} className="ml-1 text-slate-400"/>}
              </div>
            </div>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSettingsOpen ? 'max-h-[500px] opacity-100 pb-6 px-5' : 'max-h-0 opacity-0 px-5 pb-0'}`}>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 flex flex-col gap-4">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5"><MapPin size={16} className="text-red-400"/> {t('changeBaseCity')}</label>
                  <select className="bg-slate-700/80 text-white text-sm font-medium rounded-lg px-3 py-2 outline-none border border-slate-600 cursor-pointer max-w-[150px] truncate" value={baseCityId} onChange={(e) => handleBaseCityChange(e.target.value)}>
                    {myCities.map(city => (<option key={city.id} value={city.id}>{city.flag} {city.name[currentLang]}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-1.5"><Calendar size={16} /> {t('specificDateTime')} ({baseCity.name[currentLang]} {t('local')})</label>
                  <div className="flex flex-col gap-3">
                    <div className="relative w-full">
                      <div className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-between">
                        <span>{customBaseTime ? formatCustomDateTimeDisplay(customBaseTime, currentLang) : t('specificDateTime')}</span>
                        <Calendar size={18} className="text-gray-400" />
                      </div>
                      <input type="datetime-local" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer" value={customBaseTime} onChange={(e) => setCustomBaseTime(e.target.value)} onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }} />
                    </div>
                    {isCustom && (
                      <button onClick={() => setCustomBaseTime('')} className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-500 hover:bg-blue-400 transition-colors text-white rounded-xl text-sm font-semibold shadow-lg"><RotateCcw size={16} />{t('backToRealTime')}</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className={`px-4 py-3 border-b flex items-center justify-between shrink-0 z-10 gap-2 transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex-1 min-w-0 flex items-center">
              <span className="text-[13px] sm:text-sm font-bold flex items-center gap-1.5 min-w-0">
                {isCustom ? (
                  <><Calendar size={15} className="text-blue-500 shrink-0"/> <span className="text-blue-500 truncate">{formatDateForZone(referenceDate, baseCity.tz)} {formatTimeForZone(referenceDate, baseCity.tz)}</span></>
                ) : (
                  <><Clock size={15} className="text-green-500 shrink-0"/> <span className={isDark ? 'text-gray-400 truncate' : 'text-gray-500 truncate'}>{t('realTimeSync')}</span></>
                )}
              </span>
              {isCustom && (<button onClick={() => setCustomBaseTime('')} className={`ml-2 flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold shrink-0 ${isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-700'}`}><RotateCcw size={12} strokeWidth={2.5} />{t('reset')}</button>)}
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={() => setIsMeetingModalOpen(true)} className={`flex items-center justify-center p-1.5 rounded-lg transition-all border ${isDark ? 'bg-slate-800 border-slate-700 text-green-400 hover:bg-slate-700' : 'bg-white border-gray-200 text-green-600 hover:bg-gray-50'}`} title={t('findMeetingTime')}><Users size={16} /></button>
              <button onClick={handleSaveComboClick} className={`flex items-center justify-center p-1.5 rounded-lg transition-all border ${isDark ? 'bg-slate-800 border-slate-700 text-blue-400 hover:bg-slate-700' : 'bg-white border-gray-200 text-blue-600 hover:bg-gray-50'}`} title={t('saveCombo')}><Save size={16} /></button>
              <button onClick={handleMergeClick} className={`relative flex items-center justify-center p-1.5 rounded-lg transition-all border ${isMergedMode ? (isDark ? 'bg-blue-900/30 border-blue-800 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm') : (isDark ? 'bg-slate-800 border-slate-700 text-gray-400 hover:bg-slate-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50')}`} title={t('mergeTimes')}>
                <Combine size={16} strokeWidth={isMergedMode ? 2.5 : 2} />
                {!isPro && <Crown size={10} className="absolute -top-1 -right-1 text-amber-500 drop-shadow-sm" fill="currentColor" />}
              </button>
              <button onClick={() => setIsAppConfigModalOpen(true)} className={`flex items-center justify-center p-1.5 rounded-lg transition-all border ${isDark ? 'bg-slate-800 border-slate-700 text-gray-400 hover:bg-slate-700' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`} title={t('appSettings')}><Settings size={16} /></button>
              <div className={`flex rounded-lg p-0.5 shadow-inner ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}>
                <button onClick={() => setViewMode('list')} className={`p-1 rounded-md transition-all ${viewMode === 'list' ? (isDark ? 'bg-slate-700 text-blue-400' : 'bg-white text-blue-600 shadow-sm') : 'text-gray-400'}`}><List size={16} strokeWidth={2.5} /></button>
                <button onClick={handleGridClick} className={`relative p-1 rounded-md transition-all ${viewMode === 'grid' ? (isDark ? 'bg-slate-700 text-blue-400' : 'bg-white text-blue-600 shadow-sm') : 'text-gray-400'}`}>
                  <LayoutGrid size={16} strokeWidth={2.5} />
                  {!isPro && <Crown size={10} className="absolute -top-1 -right-1 text-amber-500 drop-shadow-sm" fill="currentColor" />}
                </button>
              </div>
            </div>
          </div>

          <main className={`flex-1 overflow-y-auto p-4 z-0 relative transition-colors duration-300 ${!isPro ? 'pb-[130px]' : 'pb-[90px]'} ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
              {displayCities.map((city, index) => {
                const isBaseCity = city.isMerged ? city.originalCities.some(c => c.id === baseCityId) : city.id === baseCityId;
                let tzAbbr = getTzAbbreviation(referenceDate, city.tz);
                let isDST = tzAbbr.includes('D') || tzAbbr === 'BST' || tzAbbr === 'CEST';
                if (city.isMerged) {
                  const abbrs = Array.from(new Set(city.originalCities.map(c => getTzAbbreviation(referenceDate, c.tz))));
                  tzAbbr = abbrs.join(', '); isDST = abbrs.some(a => a.includes('D') || a === 'BST' || a === 'CEST');
                }
                const isGrid = viewMode === 'grid';
                const dayDiffData = getDayDifference(referenceDate, baseCity.tz, city.tz);
                const hourDiffStr = getHourDifferenceStr(city.tz, baseCity.tz, referenceDate);

                return (
                  <div key={city.id} draggable onDragStart={(e) => handleCityDragStart(e, index)} onDragEnter={(e) => handleCityDragEnter(e, index)} onDragEnd={handleCityDragEnd} onDragOver={(e)=>e.preventDefault()} className={`rounded-2xl shadow-sm border transition-all relative group ${isBaseCity ? (isDark ? 'border-blue-500 ring-1 ring-blue-500 bg-slate-800' : 'border-slate-800 ring-2 ring-slate-800 bg-white') : (isDark ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white')} ${isGrid ? 'p-4 flex flex-col justify-between h-full min-h-[160px]' : 'p-5'} ${draggedCityIdx === index ? 'opacity-80 scale-[0.98] z-20 shadow-lg ring-2 ring-blue-500/50' : ''}`}>
                    <div className={`absolute flex items-center gap-0.5 z-10 ${isGrid ? 'top-2 right-2' : 'top-3 right-3'}`}>
                      <div className={`cursor-grab active:cursor-grabbing touch-none p-1.5 rounded-full transition-colors ${draggedCityIdx === index ? 'text-blue-500' : (isDark ? 'text-gray-400 hover:bg-slate-700' : 'text-gray-400 hover:bg-gray-100')}`} onTouchStart={(e) => handleCityTouchStart(e, index)} onTouchMove={handleCityTouchMove} onTouchEnd={handleCityTouchEnd}><Menu size={18} /></div>
                      {!isBaseCity && (
                        <>
                          <button onClick={(e) => { handleBaseCityChange(city.isMerged ? city.originalCities[0].id : city.id); e.currentTarget.blur(); }} className={`transition-colors p-1.5 rounded-full ${isDark ? 'text-gray-400 hover:bg-slate-700 active:text-blue-400' : 'text-gray-300 hover:bg-gray-100 active:text-blue-500'}`}><MapPin size={18} /></button>
                          <button onClick={(e) => { removeCity(city.id); e.currentTarget.blur(); }} className={`transition-colors p-1.5 rounded-full ${isDark ? 'text-gray-400 hover:bg-slate-700 active:text-red-400' : 'text-gray-300 hover:bg-gray-100 active:text-red-500'}`}><Trash2 size={18} /></button>
                        </>
                      )}
                    </div>
                    <div className={`flex justify-between items-start ${isGrid ? 'mb-1' : 'mb-1'}`}>
                      <div className={`flex ${isGrid ? 'flex-col items-start gap-1.5' : 'items-center gap-3'}`}>
                        <span className={`${isGrid ? 'text-2xl' : 'text-3xl drop-shadow-sm'}`}>{city.flag}</span>
                        <div>
                          <h2 className={`font-bold leading-tight flex items-center gap-2 pr-16 ${isDark ? 'text-gray-100' : 'text-gray-900'} ${isGrid ? 'text-sm' : 'text-lg'}`}>{city.isMerged ? city.name[currentLang] : city.name[currentLang]}</h2>
                          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                            {!isGrid && <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} ${city.isMerged ? 'truncate max-w-[150px]' : ''}`}>{city.isMerged ? city.country[currentLang] : city.country[currentLang]}</p>}
                            {!isGrid && <span className={`text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>•</span>}
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${isDST ? (isDark ? 'bg-amber-900/30 text-amber-500' : 'bg-amber-100 text-amber-700') : (isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600')}`}>
                              {isDST && <Sun size={10} />} {tzAbbr}
                            </span>
                            {city.isMerged && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ml-1 ${isDark ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}><Combine size={10} /> {t('merged')}</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`flex ${isGrid ? 'flex-col items-start mt-auto' : 'justify-between items-end mt-4'} ${isBaseCity ? `cursor-pointer transition-colors p-2 -mx-2 -mb-2 rounded-xl ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-slate-100'}` : ''}`} onClick={() => { if (isBaseCity) { if (!customBaseTime) setCustomBaseTime(getLocalDatetimeString(realTime, baseCity.tz)); setIsTimeEditModalOpen(true); } }}>
                      <div className={`flex flex-col ${isGrid ? 'gap-1 mb-1.5 order-2 w-full' : 'gap-1.5'}`}>
                        {!isBaseCity ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`w-fit text-[10px] px-1.5 py-0.5 rounded-md font-bold ${dayDiffData.status === 'today' ? (isDark ? 'bg-slate-700 text-gray-300' : 'bg-gray-100 text-gray-600') : dayDiffData.status === 'future' ? (isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-700') : (isDark ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-700')}`}>{dayDiffData.text}</span>
                            {hourDiffStr && <span className={`w-fit text-[10px] px-1.5 py-0.5 rounded-md font-bold ${isDark ? 'bg-slate-700/80 text-gray-400' : 'bg-gray-200/80 text-gray-500'}`}>{hourDiffStr}</span>}
                          </div>
                        ) : <span className={`w-fit text-[10px] px-1.5 py-0.5 rounded-md font-bold text-white flex items-center gap-1 shadow-sm ${isDark ? 'bg-blue-600' : 'bg-slate-800'}`}><MapPin size={8} /> {t('baseCityLabel')}</span>}
                        <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} ${isGrid ? 'text-[11px] leading-tight break-keep' : 'text-sm'}`}>{formatDateForZone(referenceDate, city.tz)}</span>
                      </div>
                      <div className={`font-black tracking-tight flex items-center gap-1.5 ${isBaseCity ? (isDark ? 'text-blue-400' : 'text-slate-800') : (isDark ? 'text-gray-100' : 'text-gray-900')} ${isGrid ? 'text-[22px] order-1' : 'text-3xl'}`}>
                        {formatTimeForZone(referenceDate, city.tz)} {isBaseCity && <Pencil size={isGrid ? 14 : 18} className={`${isDark ? 'text-blue-500/50' : 'text-slate-400 opacity-70'}`} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button onClick={handleAddCityClick} className={`w-full py-4 mt-4 mb-6 border-2 border-dashed rounded-2xl font-bold flex items-center justify-center gap-2 transition-all relative overflow-hidden ${isDark ? 'border-slate-700 text-gray-400 hover:bg-slate-800' : 'border-gray-300 text-gray-500 hover:bg-blue-50'}`}>
              <Plus size={20} />{t('addCityBtn')}
              {!isPro && myCities.length >= 4 && <div className="absolute top-0 right-0 p-2"><Crown size={14} className="text-amber-500" fill="currentColor"/></div>}
            </button>
          </main>
        </div>

        {/* === 2. 저장 리스트 탭 === */}
        <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out ${activeTab === 'saved' ? 'translate-x-0' : 'translate-x-full'}`}>
          <header className={`px-5 pt-8 pb-4 border-b flex justify-between items-center z-10 shrink-0 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
            <h1 className={`text-[30px] font-bold tracking-tight leading-none flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}><FolderOpen size={30} className={isDark ? 'text-blue-400' : 'text-blue-500'} />{t('savedList')}</h1>
          </header>
          <main className={`flex-1 overflow-y-auto p-4 ${!isPro ? 'pb-[130px]' : 'pb-[90px]'} ${isDark ? 'bg-black' : 'bg-gray-100'}`}>
            {savedLists.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3"><Bookmark size={48} className="opacity-50" /><p>{t('noSavedLists')}</p><p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{t('noSavedDesc')}</p></div>
            ) : (
              <div className="flex flex-col gap-3">
                {savedLists.map((list) => {
                  const citiesInfo = list.cityIds.map(id => ALL_CITIES.find(c => c.id === id)).filter(Boolean);
                  const cityNames = citiesInfo.map(c => c.name[currentLang]).join(', '); // 도시 이름 추출
                  const dateStr = new Intl.DateTimeFormat(localeMap[currentLang], { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(list.createdAt));
                  return (
                    <div key={list.id} className={`rounded-2xl shadow-sm border p-4 flex flex-col gap-4 transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0 pr-4">
                          {editingListId === list.id ? (
                            <input
                              type="text"
                              autoFocus
                              className={`select-text font-bold text-lg mb-1 w-full bg-transparent border-b-2 outline-none ${isDark ? 'text-white border-blue-500' : 'text-gray-900 border-blue-500'}`}
                              value={editingListName}
                              onChange={(e) => setEditingListName(e.target.value)}
                              onBlur={saveEditedListName}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditedListName();
                                if (e.key === 'Escape') setEditingListId(null);
                              }}
                            />
                          ) : (
                            <h3 
                              onClick={() => startEditingList(list)} 
                              className={`font-bold text-lg mb-1 flex items-center gap-2 group cursor-pointer max-w-full w-fit ${isDark ? 'text-gray-100 hover:text-blue-400' : 'text-gray-900 hover:text-blue-600'}`}
                              title={t('edit')}
                            >
                              <span className="truncate">{list.name}</span>
                              <Pencil size={14} className="opacity-40 group-hover:opacity-100 transition-opacity shrink-0" />
                            </h3>
                          )}
                          <div className={`text-xs font-medium flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span>{t('citiesCount')} {list.cityIds.length}</span>
                            <span className={isDark ? 'text-slate-600' : 'text-gray-300'}>•</span>
                            <span>{dateStr}</span>
                          </div>
                        </div>
                        <button onClick={() => deleteSavedList(list.id)} className={`p-2 rounded-full shrink-0 transition-colors ${isDark ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}><Trash2 size={18} /></button>
                      </div>
                      <div className={`p-3 rounded-xl flex items-center justify-between gap-3 ${isDark ? 'bg-slate-900/50' : 'bg-gray-50'}`}>
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium truncate block ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                            {cityNames}
                          </span>
                        </div>
                        <button onClick={() => loadSavedList(list)} className={`shrink-0 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-1.5 transition-colors ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'}`}><Play size={14} fill="currentColor" /> {t('load')}</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>

        {/* === 3. 글로벌 알람 탭 === */}
        <div className={`absolute inset-0 flex flex-col transition-transform duration-300 ease-in-out ${activeTab === 'alarm' ? 'translate-x-0' : 'translate-x-full'}`}>
          <header className={`px-5 pt-8 pb-2 flex justify-between items-center z-10 shrink-0 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <button onClick={() => setIsAlarmEditMode(!isAlarmEditMode)} className="text-blue-500 font-semibold text-lg">{isAlarmEditMode ? t('done') : t('edit')}</button>
            <button onClick={handleAddAlarmClick} className={`relative text-blue-500 p-1`}>
              <Plus size={28} />
              {!isPro && alarms.length >= 2 && <Crown size={12} className="absolute top-0 right-0 text-amber-500" fill="currentColor"/>}
            </button>
          </header>
          <div className={`px-5 pb-3 z-10 shrink-0 flex items-end justify-between ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <h1 className={`text-[34px] font-bold tracking-tight leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('globalAlarm')}</h1>
          </div>
          <div className={`px-5 pb-3 border-b z-10 shrink-0 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
            <div className={`flex p-1 rounded-xl shadow-inner ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}>
              <button onClick={() => setAlarmDisplayMode('target')} className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg ${alarmDisplayMode === 'target' ? (isDark ? 'bg-slate-700 text-blue-400 shadow-sm' : 'bg-white shadow-sm text-blue-600') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>{t('targetCityTime')}</button>
              <button onClick={() => setAlarmDisplayMode('local')} className={`flex-1 py-1.5 text-[13px] font-bold rounded-lg ${alarmDisplayMode === 'local' ? (isDark ? 'bg-slate-700 text-blue-400 shadow-sm' : 'bg-white shadow-sm text-blue-600') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>{t('localDeviceTime')}</button>
            </div>
          </div>
          <main className={`flex-1 overflow-y-auto ${!isPro ? 'pb-[130px]' : 'pb-[90px]'} ${isDark ? 'bg-black' : 'bg-white'}`}>
            {alarms.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-3"><AlarmClock size={48} className="opacity-50" /><p>{t('noAlarms')}</p></div>
            ) : (
              <div className="flex flex-col">
                {alarms.map((alarm, index) => {
                  const city = ALL_CITIES.find(c => c.id === alarm.cityId) || ALL_CITIES[0];
                  const absDate = new Date(alarm.timestamp);
                  const targetTimeParts = formatTimeForZone(absDate, city.tz).split(' ');
                  const localTimeParts = new Intl.DateTimeFormat(localeMap[currentLang], { hour: 'numeric', minute: '2-digit', hour12: true }).format(absDate).split(' ');
                  const targetDateStr = formatDateForZone(absDate, city.tz);
                  const localDateStr = new Intl.DateTimeFormat(localeMap[currentLang], { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' }).format(absDate);

                  // 언어권에 따라 오전/오후 위치 보정
                  const getAmpmTime = (parts) => parts.length > 1 && !/\d/.test(parts[0]) ? { ampm: parts[0], time: parts[1] } : { ampm: parts[1] || '', time: parts[0] };
                  
                  const target = getAmpmTime(targetTimeParts);
                  const local = getAmpmTime(localTimeParts);

                  const isTargetMode = alarmDisplayMode === 'target';
                  const primaryAmpm = isTargetMode ? target.ampm : local.ampm;
                  const primaryTime = isTargetMode ? target.time : local.time;
                  const primaryDateStr = isTargetMode ? targetDateStr : localDateStr;
                  const secondaryLabel = isTargetMode ? `${t('myDevice')} (${getDeviceLocationName()})` : `${city.name[currentLang]} ${t('baseCity')}`;
                  const secondaryDateStr = isTargetMode ? localDateStr : targetDateStr;
                  const secondaryTimeStr = isTargetMode ? `${local.ampm} ${local.time}` : `${target.ampm} ${target.time}`;

                  return (
                    <div key={alarm.id} draggable={isAlarmEditMode} onDragStart={(e) => handleAlarmDragStart(e, index)} onDragEnter={(e) => handleAlarmDragEnter(e, index)} onDragEnd={handleAlarmDragEnd} onDragOver={(e) => e.preventDefault()} className={`flex items-center justify-between py-4 px-5 border-b transition-all ${isDark ? 'border-slate-800 bg-slate-900' : 'border-gray-100 bg-white'} ${draggedAlarmIdx === index ? 'opacity-80 scale-[0.98] z-20 shadow-lg' : ''}`}>
                      {isAlarmEditMode && <button onClick={() => deleteAlarm(alarm.id)} className="mr-3 animate-in slide-in-from-left-2"><MinusCircle size={24} className="text-red-500" fill="white" /></button>}
                      <div className="flex-1 flex flex-col cursor-pointer" onClick={() => openEditAlarmModal(alarm)}>
                        <div className={`text-xs font-bold mb-1 flex items-center gap-1.5 ${alarm.isEnabled && !isAlarmEditMode ? 'text-blue-500' : 'text-gray-500'}`}>
                          {isTargetMode ? (<><span>{city.flag} {city.name[currentLang]}</span><span className={`font-normal ${isDark ? 'text-slate-600' : 'text-gray-300'}`}>•</span><span className={alarm.isEnabled && !isAlarmEditMode ? (isDark ? 'text-gray-400' : 'text-gray-500') : ''}>{primaryDateStr}</span></>) : (<><MapPin size={12} className={alarm.isEnabled && !isAlarmEditMode ? 'text-blue-500' : 'text-gray-500'} /><span>{t('local')}</span><span className={`font-normal ${isDark ? 'text-slate-600' : 'text-gray-300'}`}>•</span><span className={alarm.isEnabled && !isAlarmEditMode ? (isDark ? 'text-gray-400' : 'text-gray-500') : ''}>{primaryDateStr}</span></>)}
                        </div>
                        <div className={`text-[40px] font-light tracking-tight flex items-baseline gap-1.5 ${alarm.isEnabled && !isAlarmEditMode ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-slate-600' : 'text-gray-400')}`}>
                          {currentLang === 'en' ? <>{primaryTime} <span className="text-[22px] font-medium">{primaryAmpm}</span></> : <><span className="text-[22px] font-medium">{primaryAmpm}</span>{primaryTime}</>}
                        </div>
                        <div className="flex flex-col mt-1 gap-1.5">
                          <span className={`text-sm font-medium flex items-center gap-1 ${alarm.isEnabled && !isAlarmEditMode ? (isDark ? 'text-gray-300' : 'text-gray-600') : (isDark ? 'text-slate-500' : 'text-gray-400')}`}>{alarm.label}</span>
                          <div className={`text-[11px] px-2 py-1 rounded-md w-fit font-bold flex items-center gap-1.5 ${alarm.isEnabled && !isAlarmEditMode ? (isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700') : (isDark ? 'bg-slate-800 text-slate-500' : 'bg-gray-100 text-gray-400')}`}>
                            {isTargetMode ? <BellRing size={12} className={alarm.isEnabled && !isAlarmEditMode ? 'text-blue-500' : 'text-gray-400'} /> : <Globe size={12} className={alarm.isEnabled && !isAlarmEditMode ? 'text-blue-500' : 'text-gray-400'} />}
                            {secondaryLabel}: {secondaryDateStr} {secondaryTimeStr}
                          </div>
                        </div>
                      </div>
                      {!isAlarmEditMode ? (
                        <div onClick={() => toggleAlarm(alarm.id)} className={`w-[52px] h-[32px] flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${alarm.isEnabled ? 'bg-green-500' : (isDark ? 'bg-slate-700' : 'bg-gray-200')}`}><div className={`bg-white w-[24px] h-[24px] rounded-full shadow-sm transform transition-transform ${alarm.isEnabled ? 'translate-x-[20px]' : 'translate-x-0'}`} /></div>
                      ) : <div className={`ml-3 cursor-grab touch-none flex py-2 px-1 transition-colors ${draggedAlarmIdx === index ? 'text-blue-500' : 'text-gray-400 hover:text-gray-500'}`} onTouchStart={(e) => handleAlarmTouchStart(e, index)} onTouchMove={handleAlarmTouchMove} onTouchEnd={handleAlarmTouchEnd}><Menu size={24} strokeWidth={2.5} /></div>}
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>

        {/* === 모달 및 팝업 영역 === */}

        {/* 도시 추가 팝업 */}
        {isAddingMode && (
          <div className={`absolute inset-0 z-[60] flex flex-col animate-in slide-in-from-bottom-4 duration-200 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className={`px-4 pt-6 pb-4 border-b shadow-sm shrink-0 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
              <div className="flex items-center justify-between mb-4"><h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>{t('addCityTitle')}</h2><button onClick={() => setIsAddingMode(false)} className={`p-2 rounded-full ${isDark ? 'text-gray-400 hover:bg-slate-800' : 'text-gray-500 hover:bg-gray-100'}`}><X size={24} /></button></div>
              <div className="relative"><Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /><input type="text" autoFocus placeholder={t('searchPlaceholder')} className={`select-text w-full pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-800 text-white placeholder-gray-500' : 'bg-gray-100 text-gray-900'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
            </div>
            <div className={`flex-1 overflow-y-auto p-3 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
              {filteredCities.map(city => {
                const isAlreadyAdded = myCities.some(c => c.id === city.id);
                return (
                  <button key={city.id} onClick={() => !isAlreadyAdded && addCity(city)} disabled={isAlreadyAdded} className={`w-full flex items-center justify-between p-4 rounded-xl border mb-2 transition-all text-left ${isAlreadyAdded ? (isDark ? 'opacity-50 cursor-not-allowed bg-slate-900 border-slate-800' : 'opacity-50 cursor-not-allowed bg-gray-50') : (isDark ? 'bg-slate-800 border-slate-700 hover:border-blue-500 active:bg-slate-700' : 'bg-white hover:border-blue-400 active:bg-blue-50')}`}>
                    <div className="flex items-center gap-3"><span className="text-2xl">{city.flag}</span><div><div className={`font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{city.name[currentLang]}</div><div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{city.country[currentLang]}</div></div></div>
                    {!isAlreadyAdded && <Plus size={20} className={isDark ? 'text-blue-400' : 'text-blue-500'} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 현재 도시 조합 저장 팝업 */}
        {isSaveListModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[80] flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
            <div className={`rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
              <div className={`px-5 pt-6 pb-4 border-b flex justify-between items-center ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}><Bookmark size={20} className={isDark ? 'text-blue-400' : 'text-blue-500'} /> {t('saveCurrentBundle')}</h2>
                <button onClick={() => setIsSaveListModalOpen(false)} className={`p-2 -mr-2 rounded-full ${isDark ? 'text-gray-400 hover:bg-slate-800' : 'text-gray-400 hover:bg-gray-100'}`}><X size={20} /></button>
              </div>
              <div className={`p-5 flex flex-col gap-5 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                <div>
                  <label className={`block text-sm font-bold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('listName')}</label>
                  <input type="text" autoFocus placeholder={t('listNamePlaceholder')} className={`select-text w-full px-4 py-3 rounded-xl outline-none focus:ring-2 border ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`} value={newListName} onChange={(e) => setNewListName(e.target.value)} />
                  <p className={`text-xs mt-3 font-medium flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="shrink-0">{t('toBeSaved')} ({myCities.length}):</span>
                    <span className="truncate">{myCities.map(c => c.name[currentLang]).join(', ')}</span>
                  </p>
                </div>
                <button onClick={saveCurrentList} disabled={!newListName.trim()} className={`w-full py-3.5 font-bold rounded-xl shadow-md ${!newListName.trim() ? (isDark ? 'bg-slate-700 text-gray-500' : 'bg-gray-200 text-gray-400') : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>{t('saveAction')}</button>
              </div>
            </div>
          </div>
        )}

        {/* 최적 회의 시간 팝업 */}
        {isMeetingModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[80] flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
            <div className={`rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
              <div className={`px-5 pt-6 pb-4 border-b flex justify-between items-center shrink-0 ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                <div>
                  <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}><Users size={20} className={isDark ? 'text-green-400' : 'text-green-500'} /> {t('optimalMeeting')}</h2>
                  <p className={`text-[11px] mt-1 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('basedOn')} <span className={isDark?'text-blue-400':'text-blue-600'}>{formatDateForZone(referenceDate, baseCity.tz)}</span>{t('dayBase')}</p>
                </div>
                <button onClick={() => setIsMeetingModalOpen(false)} className={`p-2 -mr-2 rounded-full ${isDark ? 'text-gray-400 hover:bg-slate-800' : 'text-gray-400 hover:bg-gray-100'}`}><X size={20} /></button>
              </div>
              <div className={`flex-1 overflow-y-auto p-5 flex flex-col gap-4 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                {myCities.length < 2 ? (
                  <div className="flex flex-col items-center text-center py-10 gap-3 opacity-60"><Globe size={40} className={isDark ? "text-gray-500" : "text-gray-400"} /><p className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{t('needMoreCities')}</p></div>
                ) : meetingProposals.map((p, idx) => {
                  const endTs = p.startTs + (p.endHour - p.startHour + 1) * 3600000;
                  const fmt = (ts) => new Intl.DateTimeFormat(localeMap[currentLang], { timeZone: baseCity.tz, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(ts));
                  const baseTimeRange = `${fmt(p.startTs)} ~ ${fmt(endTs)}`;
                  const isPerfect = p.score === myCities.length * 10;
                  const isGood = p.score > 0 && !isPerfect;
                  return (
                    <div key={idx} className={`p-4 rounded-2xl shadow-sm border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-3 border-b pb-3 border-dashed border-gray-300 dark:border-slate-600">
                        <div className="flex flex-col gap-1.5">
                          <span className={`text-[10px] font-bold w-fit px-1.5 py-0.5 rounded-md ${isPerfect ? (isDark ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-700') : isGood ? (isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-700') : (isDark ? 'bg-orange-900/40 text-orange-400' : 'bg-orange-100 text-orange-700')}`}>{isPerfect ? t('perfectMatch') : isGood ? t('goodMatch') : t('compromiseMatch')}</span>
                          <span className={`font-black text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{baseTimeRange}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        {p.details.map(d => {
                          const lStart = new Intl.DateTimeFormat(localeMap[currentLang], { timeZone: d.city.tz, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(p.startTs));
                          const lEnd = new Intl.DateTimeFormat(localeMap[currentLang], { timeZone: d.city.tz, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(endTs));
                          const stateColor = d.state === 'work' ? (isDark ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-100') : d.state === 'extend' ? (isDark ? 'text-orange-400 bg-orange-900/30' : 'text-orange-600 bg-orange-100') : (isDark ? 'text-slate-400 bg-slate-700' : 'text-slate-500 bg-slate-100');
                          return (
                            <div key={d.city.id} className="flex justify-between items-center text-sm">
                              <span className={`flex items-center gap-1.5 font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}><span>{d.city.flag}</span><span className="max-w-[80px] truncate">{d.city.name[currentLang]}</span></span>
                              <div className="flex items-center gap-2"><span className={`text-[11px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{lStart} ~ {lEnd}</span><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded w-[34px] text-center ${stateColor}`}>{t(d.state)}</span></div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 앱 설정 팝업 */}
        {isAppConfigModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[80] flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
            <div className={`rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
              <div className={`px-5 pt-6 pb-4 border-b flex justify-between items-center shrink-0 ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
                <h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}><Settings size={20} className={isDark ? 'text-blue-400' : 'text-blue-500'} /> {t('appSettings')}</h2>
                <button onClick={() => setIsAppConfigModalOpen(false)} className={`p-2 -mr-2 rounded-full ${isDark ? 'text-gray-400 hover:bg-slate-800' : 'text-gray-400 hover:bg-gray-100'}`}><X size={20} /></button>
              </div>
              <div className={`p-5 flex-1 overflow-y-auto flex flex-col gap-6 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                
                {/* PRO 업그레이드 유도 배너 (설정 탭) */}
                {!isPro ? (
                  <div onClick={() => setPaywallReason('premium')} className="cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-2xl shadow-lg flex items-center justify-between text-white transform hover:scale-[1.02] transition-transform">
                    <div>
                      <h3 className="font-black text-lg flex items-center gap-1.5"><Crown size={20} fill="currentColor"/> {t('proUpgrade')}</h3>
                      <p className="text-xs mt-1 font-medium opacity-90">{t('unlockAll')}</p>
                    </div>
                    <ChevronRight size={24} className="opacity-80" />
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-2xl shadow-lg flex items-center justify-between text-white">
                    <h3 className="font-bold flex items-center gap-2"><CheckCircle size={20} /> {t('alreadyPro')}</h3>
                  </div>
                )}

                <div>
                  <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('theme')}</label>
                  <div className={`flex rounded-xl p-1 shadow-inner ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}>
                    <button onClick={() => setTheme('light')} className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-xs font-bold rounded-lg ${theme === 'light' ? (isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-blue-600 shadow-sm') : 'text-gray-500'} `}><Sun size={20} /> {t('light')}</button>
                    <button onClick={() => setTheme('dark')} className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-xs font-bold rounded-lg ${theme === 'dark' ? (isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-blue-600 shadow-sm') : 'text-gray-500'} `}><Moon size={20} /> {t('dark')}</button>
                    <button onClick={() => setTheme('system')} className={`flex-1 flex flex-col items-center gap-1.5 py-3 text-xs font-bold rounded-lg ${theme === 'system' ? (isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-blue-600 shadow-sm') : 'text-gray-500'} `}><Monitor size={20} /> {t('system')}</button>
                  </div>
                  <p className={`text-[11px] mt-2 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('themeDesc')}</p>
                </div>

                {/* 다국어 설정 */}
                <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                  <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('language')}</label>
                  <div className={`flex rounded-xl p-1 shadow-inner flex-wrap ${isDark ? 'bg-slate-800' : 'bg-gray-200'}`}>
                    <button onClick={() => setAppLang('system')} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold rounded-lg ${appLang === 'system' ? (isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-blue-600 shadow-sm') : 'text-gray-500'} `}><Languages size={14} /> Auto</button>
                    <button onClick={() => setAppLang('ko')} className={`flex-1 py-3 text-xs font-bold rounded-lg ${appLang === 'ko' ? (isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-blue-600 shadow-sm') : 'text-gray-500'} `}>한국어</button>
                    <button onClick={() => setAppLang('en')} className={`flex-1 py-3 text-xs font-bold rounded-lg ${appLang === 'en' ? (isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-blue-600 shadow-sm') : 'text-gray-500'} `}>English</button>
                    <button onClick={() => setAppLang('ja')} className={`flex-1 py-3 text-xs font-bold rounded-lg ${appLang === 'ja' ? (isDark ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-blue-600 shadow-sm') : 'text-gray-500'} `}>日本語</button>
                  </div>
                </div>

                <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                  <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('workHoursTitle')}</label>
                  <div className="flex items-center gap-2">
                    <select value={workHours.start} onChange={(e) => setWorkHours(prev => ({ ...prev, start: parseFloat(e.target.value) }))} className={`flex-1 p-2 rounded-lg border outline-none text-sm font-bold text-center appearance-none cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
                      {Array.from({ length: 48 }, (_, i) => i * 0.5).map((val) => (<option key={`s-${val}`} value={val}>{`${Math.floor(val).toString().padStart(2, '0')}:${val%1!==0?'30':'00'}`}</option>))}
                    </select>
                    <span className={`font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>~</span>
                    <select value={workHours.end} onChange={(e) => setWorkHours(prev => ({ ...prev, end: parseFloat(e.target.value) }))} className={`flex-1 p-2 rounded-lg border outline-none text-sm font-bold text-center appearance-none cursor-pointer ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900 shadow-sm'}`}>
                      {Array.from({ length: 48 }, (_, i) => i * 0.5).map((val) => (<option key={`e-${val}`} value={val}>{`${Math.floor(val).toString().padStart(2, '0')}:${val%1!==0?'30':'00'}`}</option>))}
                    </select>
                  </div>
                  <p className={`text-[11px] mt-2 leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t('workHoursDesc1')}<br/>{t('workHoursDesc2')}</p>
                </div>

                <div className={`pt-4 border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                  <label className={`block text-sm font-bold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{t('meetingCriteria')}</label>
                  <div className={`flex flex-col gap-2`}>
                    <label onClick={(e) => { if (!isPro) e.preventDefault(); handleCriteriaSelect('strict'); }} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${meetingCriteria === 'strict' ? (isDark ? 'bg-slate-700 border-blue-500' : 'bg-blue-50 border-blue-400') : (isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}`}>
                      <input type="radio" name="criteria" value="strict" checked={meetingCriteria === 'strict'} readOnly className="hidden" />
                      <div className="flex-1">
                        <div className={`text-sm font-bold flex items-center gap-1 ${meetingCriteria === 'strict' ? (isDark ? 'text-blue-400' : 'text-blue-700') : (isDark ? 'text-gray-200' : 'text-gray-800')}`}>{t('criteriaStrict')} {!isPro && <Crown size={12} className="text-amber-500" fill="currentColor" />}</div>
                        <div className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('criteriaStrictDesc')}</div>
                      </div>
                      {meetingCriteria === 'strict' && <Check size={18} className={isDark ? 'text-blue-400' : 'text-blue-600'} />}
                    </label>
                    <label onClick={() => handleCriteriaSelect('flexible')} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${meetingCriteria === 'flexible' ? (isDark ? 'bg-slate-700 border-blue-500' : 'bg-blue-50 border-blue-400') : (isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}`}>
                      <input type="radio" name="criteria" value="flexible" checked={meetingCriteria === 'flexible'} readOnly className="hidden" />
                      <div className="flex-1">
                        <div className={`text-sm font-bold ${meetingCriteria === 'flexible' ? (isDark ? 'text-blue-400' : 'text-blue-700') : (isDark ? 'text-gray-200' : 'text-gray-800')}`}>{t('criteriaFlex')}</div>
                        <div className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('criteriaFlexDesc')}</div>
                      </div>
                      {meetingCriteria === 'flexible' && <Check size={18} className={isDark ? 'text-blue-400' : 'text-blue-600'} />}
                    </label>
                    <label onClick={(e) => { if (!isPro) e.preventDefault(); handleCriteriaSelect('awake'); }} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${meetingCriteria === 'awake' ? (isDark ? 'bg-slate-700 border-blue-500' : 'bg-blue-50 border-blue-400') : (isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200')}`}>
                      <input type="radio" name="criteria" value="awake" checked={meetingCriteria === 'awake'} readOnly className="hidden" />
                      <div className="flex-1">
                        <div className={`text-sm font-bold flex items-center gap-1 ${meetingCriteria === 'awake' ? (isDark ? 'text-blue-400' : 'text-blue-700') : (isDark ? 'text-gray-200' : 'text-gray-800')}`}>{t('criteriaAwake')} {!isPro && <Crown size={12} className="text-amber-500" fill="currentColor" />}</div>
                        <div className={`text-[11px] mt-0.5 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t('criteriaAwakeDesc')}</div>
                      </div>
                      {meetingCriteria === 'awake' && <Check size={18} className={isDark ? 'text-blue-400' : 'text-blue-600'} />}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 시간 수정 팝업 */}
        {isTimeEditModalOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[60] flex flex-col items-center justify-center p-4 animate-in fade-in">
            <div className={`rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
              <div className={`px-5 pt-6 pb-4 border-b flex justify-between items-center ${isDark ? 'border-slate-800' : 'border-gray-100'}`}><h2 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}><Calendar size={20} className={isDark ? 'text-blue-400' : 'text-blue-500'} />{baseCity.name[currentLang]} {t('timeChangeTitle')}</h2><button onClick={() => setIsTimeEditModalOpen(false)} className={`p-2 -mr-2 rounded-full ${isDark ? 'text-gray-400 hover:bg-slate-800' : 'text-gray-400 hover:bg-gray-100'}`}><X size={20} /></button></div>
              <div className={`p-5 flex flex-col gap-5 ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                <div className={`relative p-3 rounded-2xl border shadow-sm flex items-center justify-between ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                  <span className={`font-medium text-base sm:text-lg pl-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{customBaseTime ? formatCustomDateTimeDisplay(customBaseTime, currentLang) : t('specificDateTime')}</span>
                  <Calendar size={20} className={isDark ? 'text-blue-400' : 'text-blue-500'} />
                  <input type="datetime-local" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer" value={customBaseTime} onChange={(e) => setCustomBaseTime(e.target.value)} onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }} />
                </div>
                <div className="flex gap-3 items-stretch">
                  <button onClick={() => { setCustomBaseTime(''); setIsTimeEditModalOpen(false); }} className={`flex-1 py-2 px-3 border font-bold rounded-xl flex justify-center items-center gap-2 ${isDark ? 'bg-slate-800 border-slate-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
                    <RotateCcw size={18} className="shrink-0" />
                    <span className="text-[13px] leading-tight whitespace-pre-line text-left break-keep">{t('backToRealTimeModal')}</span>
                  </button>
                  <button onClick={() => setIsTimeEditModalOpen(false)} className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md text-[15px] flex items-center justify-center">{t('done')}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 글로벌 알람 추가 팝업 */}
        {isAddAlarmModalOpen && (
          <div className={`absolute inset-0 z-[60] flex flex-col animate-in slide-in-from-bottom-full duration-300 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
            <header className={`px-4 py-4 border-b flex justify-between items-center shadow-sm shrink-0 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}>
              <button onClick={() => { setIsAddAlarmModalOpen(false); setEditingAlarmId(null); }} className={`font-medium text-lg px-2 ${isDark ? 'text-blue-400' : 'text-blue-500'}`}>{t('cancel')}</button>
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{editingAlarmId ? t('editAlarm') : t('addAlarm')}</h2>
              <button onClick={handleSaveNewAlarm} className={`font-bold text-lg px-2 ${isDark ? 'text-blue-400' : 'text-blue-500'}`}>{t('save')}</button>
            </header>
            <div className={`flex-1 overflow-y-auto p-5 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
              <div className={`rounded-2xl shadow-sm border overflow-hidden divide-y mb-6 ${isDark ? 'bg-slate-900 border-slate-800 divide-slate-800' : 'bg-white border-gray-100 divide-gray-100'}`}>
                <div className="flex items-center justify-between p-4"><span className={`font-medium w-24 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{t('baseCityLabel')}</span><select value={newAlarmCityId} onChange={(e) => { setNewAlarmCityId(e.target.value); setNewAlarmDatetime(getLocalDatetimeString(realTime, ALL_CITIES.find(c => c.id === e.target.value)?.tz || 'Asia/Seoul')); }} className={`text-right font-bold outline-none flex-1 ml-4 bg-transparent cursor-pointer ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{ALL_CITIES.map(city => (<option key={city.id} value={city.id} className="text-gray-900">{city.flag} {city.name[currentLang]}</option>))}</select></div>
                <div className="flex items-center justify-between p-4 relative">
                  <span className={`font-medium w-24 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{t('alarmDateTime')}</span>
                  <div className="flex-1 flex justify-end items-center relative">
                    <span className={`text-right font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{formatCustomDateTimeDisplay(newAlarmDatetime, currentLang)}</span>
                    <input type="datetime-local" value={newAlarmDatetime} onChange={(e) => setNewAlarmDatetime(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer" onClick={(e) => { try { e.target.showPicker(); } catch(err) {} }} />
                  </div>
                </div>
              </div>
              <div className={`border rounded-2xl p-4 mb-6 flex gap-3 items-start shadow-inner ${isDark ? 'bg-blue-900/20 border-blue-900/50' : 'bg-blue-50 border-blue-100'}`}>
                <BellRing size={20} className={`shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>{t('alarmDesc1')}{getDeviceLocationName()}{t('alarmDesc2')}<br/><span className={`font-bold text-base ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{getLocalDeviceEquivalent(newAlarmDatetime, ALL_CITIES.find(c => c.id === newAlarmCityId)?.tz)}</span> {t('alarmDesc3')}</p>
              </div>
              <div className={`rounded-2xl shadow-sm border overflow-hidden divide-y ${isDark ? 'bg-slate-900 border-slate-800 divide-slate-800' : 'bg-white border-gray-100 divide-gray-100'}`}>
                <div className="flex items-center justify-between p-4"><span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{t('label')}</span><input type="text" value={newAlarmLabel} onChange={(e) => setNewAlarmLabel(e.target.value)} className={`select-text text-right outline-none flex-1 ml-4 bg-transparent ${isDark ? 'text-gray-400 placeholder-gray-600' : 'text-gray-500 placeholder-gray-400'}`} placeholder={t('alarmLabelPlaceholder')} /></div>
                <div className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${isDark ? 'hover:bg-slate-800 active:bg-slate-700' : 'hover:bg-gray-50 active:bg-gray-100'}`} onClick={() => setIsSoundSelectModalOpen(true)}>
                  <span className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{t('sound')}</span>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-medium flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {ALARM_SOUNDS.find(s => s.id === newAlarmSound)?.name[currentLang]}
                      {!isPro && ALARM_SOUNDS.findIndex(s => s.id === newAlarmSound) >= 2 && <Crown size={12} className="text-amber-500" fill="currentColor"/>}
                    </span>
                    <ChevronRight size={18} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
                  </div>
                </div>
              </div>
            </div>

            {isSoundSelectModalOpen && (
              <div className={`absolute inset-0 z-[70] flex flex-col animate-in slide-in-from-right duration-300 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
                <header className={`px-4 py-4 border-b flex items-center shadow-sm shrink-0 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'}`}><button onClick={() => setIsSoundSelectModalOpen(false)} className={`flex items-center font-medium text-lg px-1 ${isDark ? 'text-blue-400' : 'text-blue-500'}`}><ChevronDown className="rotate-90 mr-1" size={24} /> {t('back')}</button><h2 className={`text-lg font-bold flex-1 text-center pr-[70px] ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('sound')}</h2></header>
                <div className={`flex-1 overflow-y-auto p-5 ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
                  <h3 className={`text-xs font-bold mb-2 ml-4 uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{t('ringtone')}</h3>
                  <div className={`rounded-2xl shadow-sm border overflow-hidden divide-y ${isDark ? 'bg-slate-900 border-slate-800 divide-slate-800' : 'bg-white border-gray-100 divide-gray-100'}`}>
                    {ALARM_SOUNDS.map((sound, idx) => (
                      <div key={sound.id} className={`flex items-center justify-between p-4 cursor-pointer ${isDark ? 'hover:bg-slate-800' : 'hover:bg-gray-50'} ${!isPro && idx >= 2 ? 'opacity-60' : ''}`} onClick={() => handleSoundSelect(sound, idx)}>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${newAlarmSound === sound.id ? (isDark ? 'text-blue-400' : 'text-blue-600') : (isDark ? 'text-gray-200' : 'text-gray-900')}`}>{sound.name[currentLang]}</span>
                          {!isPro && idx >= 2 && <Crown size={14} className="text-amber-500" fill="currentColor"/>}
                        </div>
                        {newAlarmSound === sound.id && <Check size={20} className={isDark ? 'text-blue-400' : 'text-blue-500'} strokeWidth={3} />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PAYWALL (Pro 결제 유도 모달) */}
        {paywallReason && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
              
              <button onClick={() => setPaywallReason(null)} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-10"><X size={20}/></button>
              
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 flex flex-col items-center justify-center text-white text-center">
                <div className="bg-white/20 p-4 rounded-full mb-3 backdrop-blur-sm"><Crown size={48} fill="currentColor" className="text-white drop-shadow-md"/></div>
                <h2 className="text-2xl font-black tracking-tight drop-shadow-sm">{t('proUpgrade')}</h2>
                <p className="mt-2 text-sm font-semibold opacity-90">{paywallMessages[paywallReason]}</p>
              </div>
              
              <div className={`p-6 ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`}>
                <div className="space-y-4 mb-8">
                  {[t('proFeature1'), t('proFeature2'), t('proFeature3'), t('proFeature4'), t('proFeature5')].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle size={18} className={isDark ? 'text-amber-500' : 'text-orange-500'} />
                      <span className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button onClick={() => { setIsPro(true); setPaywallReason(null); }} className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-2xl font-black text-lg shadow-lg shadow-orange-500/30 transition-all transform hover:scale-[1.02] active:scale-95">
                  {t('buyPro')}
                </button>
                <button onClick={() => { setIsPro(true); setPaywallReason(null); }} className={`w-full mt-4 text-xs font-bold underline transition-colors ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>{t('restore')}</button>
              </div>
            </div>
          </div>
        )}

      
        {/* ⭐️ 하단 메뉴바(내비게이션) 위치 수정 ⭐️ */}
       {/* ⭐️ 광고 공간 확보를 위해 높이를 120px로 늘린 메뉴바 ⭐️ */}
      <nav 
          className={`absolute bottom-0 w-full backdrop-blur-md border-t flex justify-around z-50 transition-colors duration-300 ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-gray-200'}`}
          style={{ 
            paddingBottom: isPro ? '20px' : '85px', // 결제했으면 20px로 내리고, 안 했으면 85px로 올림
            paddingTop: '15px' 
          }}
        >
          <button onClick={() => setActiveTab('worldclock')} className={`flex flex-col items-center gap-1 w-full transition-colors ${activeTab === 'worldclock' ? (isDark ? 'text-blue-400' : 'text-blue-500') : (isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500')}`}><Globe size={24} strokeWidth={activeTab === 'worldclock' ? 2.5 : 2} /><span className="text-[10px] font-bold">{t('worldClock')}</span></button>
          <button onClick={() => setActiveTab('saved')} className={`flex flex-col items-center gap-1 w-full transition-colors ${activeTab === 'saved' ? (isDark ? 'text-blue-400' : 'text-blue-500') : (isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500')}`}><Bookmark size={24} strokeWidth={activeTab === 'saved' ? 2.5 : 2} /><span className="text-[10px] font-bold">{t('savedList')}</span></button>
          <button onClick={() => setActiveTab('alarm')} className={`flex flex-col items-center gap-1 w-full transition-colors ${activeTab === 'alarm' ? (isDark ? 'text-blue-400' : 'text-blue-500') : (isDark ? 'text-gray-500 hover:text-gray-400' : 'text-gray-400 hover:text-gray-500')}`}><AlarmClock size={24} strokeWidth={activeTab === 'alarm' ? 2.5 : 2} /><span className="text-[10px] font-bold">{t('globalAlarm')}</span></button>
        </nav>

      </div>
    </div>
  );
}

// 普段の受診 ランダム問診プール
// 必須 (毎回必ず聞く)
export const CORE_QUESTIONS = [
  {
    id: 'weight',
    category: '体重変化',
    label: '体重の変化はありましたか？',
    type: 'choice',
    choices: ['変化なし', '少し増えた（+2kg未満）', 'かなり増えた（+2kg以上）', '少し減った（-2kg未満）', 'かなり減った（-2kg以上）'],
  },
  {
    id: 'belly',
    category: 'お腹の具合',
    label: 'お腹の具合はいかがですか？',
    type: 'choice',
    choices: ['問題なし', '便秘気味', '下痢気味', '腹痛あり', '胃もたれ・吐き気'],
  },
  {
    id: 'sleep',
    category: '睡眠',
    label: '眠れていますか？',
    type: 'choice',
    choices: ['よく眠れている', 'やや眠れない', '眠れない・夜中に目が覚める'],
  },
]

// オプション (毎回ランダムで4問選ぶ)
export const RANDOM_POOL = [
  {
    id: 'other_hospital',
    category: '他院受診・薬',
    label: '他の病院にかかったり、新しい薬が出ましたか？',
    type: 'yesno',
    yesPlaceholder: 'どこで・何の薬か',
  },
  {
    id: 'appetite',
    category: '食欲',
    label: '食欲はありますか？',
    type: 'choice',
    choices: ['普通', 'やや低下', 'かなり低下'],
  },
  {
    id: 'edema',
    category: 'むくみ',
    label: '足のむくみはありますか？',
    type: 'choice',
    choices: ['なし', '少しある', 'ひどい'],
  },
  {
    id: 'fatigue',
    category: '疲れ・だるさ',
    label: '疲れやすさやだるさはありますか？',
    type: 'choice',
    choices: ['変化なし', 'やや疲れやすい', 'かなり疲れやすい'],
  },
  {
    id: 'dizziness',
    category: 'めまい・ふらつき',
    label: 'めまいやふらつきはありますか？',
    type: 'yesno',
    yesPlaceholder: 'どんな時に、どの程度か',
  },
  {
    id: 'headache',
    category: '頭痛',
    label: '頭痛はありますか？',
    type: 'yesno',
    yesPlaceholder: '頻度・程度・いつから',
  },
  {
    id: 'chest',
    category: '胸の症状',
    label: '胸痛・動悸・息切れはありますか？',
    type: 'yesno',
    yesPlaceholder: 'どんな時に',
  },
  {
    id: 'cough',
    category: '咳・痰',
    label: '咳や痰は続いていますか？',
    type: 'yesno',
    yesPlaceholder: 'いつから・どんな痰か',
  },
  {
    id: 'urination',
    category: '排尿',
    label: '排尿の状態はいかがですか？',
    type: 'choice',
    choices: ['問題なし', '頻尿', '夜間頻尿', '排尿困難・尿が出にくい', '血尿'],
  },
  {
    id: 'skin',
    category: '皮膚',
    label: '皮膚に気になる変化（かゆみ・発疹など）はありますか？',
    type: 'yesno',
    yesPlaceholder: '場所・どんな症状か',
  },
  {
    id: 'vaccination',
    category: 'ワクチン',
    label: '最近ワクチンを受けましたか、または予定がありますか？',
    type: 'yesno',
    yesPlaceholder: '種類・予定日',
  },
  {
    id: 'test',
    category: '検査希望',
    label: '何か検査の希望はありますか？',
    type: 'yesno',
    yesPlaceholder: 'どんな検査か',
  },
]

// 随伴症状チェックリスト（症状あり初診用）
export const ASSOCIATED_SYMPTOMS = [
  '発熱', '頭痛', '悪心・嘔吐', '下痢', '便秘',
  '咳・痰', '息切れ', '胸痛・動悸', 'めまい',
  'しびれ・麻痺', 'むくみ', '食欲不振', '体重減少', '倦怠感',
]

// 特定健診問診（後期高齢者）
export const KENSHIN_KOUKI_QUESTIONS = [
  { id: 'k1',  label: 'この1年間に転んだことがある',                    type: 'yesno' },
  { id: 'k2',  label: '転倒に対して不安を感じる',                        type: 'yesno' },
  { id: 'k3',  label: '6ヶ月間で2〜3kg以上の体重減少があった',          type: 'yesno' },
  { id: 'k4',  label: '半年前と比べて固いものが食べにくくなった',         type: 'yesno' },
  { id: 'k5',  label: 'お茶や汁物でむせることがある',                    type: 'yesno' },
  { id: 'k6',  label: '口の渇きが気になる',                              type: 'yesno' },
  { id: 'k7',  label: '週に1回以上は外出している',                       type: 'yesno' },
  { id: 'k8',  label: '昨年と比べて外出の回数が減った',                  type: 'yesno' },
  { id: 'k9',  label: '自分で買い物や外出ができる',                      type: 'yesno' },
  { id: 'k10', label: '現在も通いの場・コミュニティがある',              type: 'yesno' },
  { id: 'k11', label: '日常生活に誰かの手助けが必要',                    type: 'yesno' },
  { id: 'k12', label: '意識的に体を動かすようにしている',                type: 'yesno' },
]

// 特定健診問診（その他 40〜74歳）
export const KENSHIN_OTHER_QUESTIONS = [
  { id: 'o1', label: '現在タバコを吸っている',          type: 'yesno',  yesPlaceholder: '本数/日' },
  { id: 'o2', label: '20歳のときより10kg以上増加した', type: 'yesno' },
  { id: 'o3', label: '1回30分以上の運動を週2回以上、1年以上続けている', type: 'yesno' },
  { id: 'o4', label: '日常生活で歩くか体を動かすことを意識している', type: 'yesno' },
  { id: 'o5', label: '食べる速度は速い',               type: 'choice', choices: ['速い', '普通', '遅い'] },
  { id: 'o6', label: '就寝前2時間以内に夕食をとることが多い', type: 'yesno' },
  { id: 'o7', label: '朝食を抜くことが週3回以上ある',  type: 'yesno' },
  { id: 'o8', label: '飲酒習慣がある',                 type: 'choice', choices: ['飲まない', '時々飲む', 'ほぼ毎日'] },
  { id: 'o9', label: '睡眠で休養が十分とれている',     type: 'yesno' },
  { id: 'o10', label: '現在治療中または経過観察中の病気がある', type: 'yesno', yesPlaceholder: '病名' },
  { id: 'o11', label: '現在服薬中の薬がある',          type: 'yesno', yesPlaceholder: '薬の名前' },
]

// 内視鏡問診
export const NAISHIKYO_QUESTIONS = {
  type: [
    { value: 'upper', label: '上部内視鏡（胃カメラ）' },
    { value: 'lower', label: '下部内視鏡（大腸カメラ）' },
  ],
  gi_symptoms: [
    '腹痛', '吐き気・嘔吐', '胸焼け', '嚥下困難', '血便・タール便',
    '下痢', '便秘', '腹部膨満', '体重減少', '症状なし',
  ],
  anticoagulants: [
    'バイアスピリン（アスピリン）', 'ワーファリン（ワルファリン）',
    'エリキュース・イグザレルト・リクシアナ・プラザキサ（DOAC）',
    'プラビックス・エフィエント（抗血小板薬）', 'なし',
  ],
}

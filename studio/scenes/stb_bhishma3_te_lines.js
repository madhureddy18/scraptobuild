// Bhishma Part 3/3 — the bed of arrows. Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Mahabharata, Bhishma Parva (fall on the 10th day, body held up by arrows, Arjuna's three arrows as a pillow, Arjuna pierces the earth and a stream of water rises),
// Shanti and Anushasana Parva (teaches Yudhishthira, waits for Uttarayana; "58 nights" on the bed; dies when the sun turns north — Bhishma Ashtami).
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.3, ...o });
window.STB_LINES = [
  LN('recap', 'నిన్న చూశాం, శిఖండి వెనక నుంచి, అర్జునుడి బాణాలు భీష్ముడిని తాకాయి.', 'Ninna choosam, Shikhandi venaka nunchi, Arjunudi *baanaalu* Bheeshmudini thaakaayi.', { gap: 0.35 }),
  LN('fall', 'పదో రోజు సాయంత్రం, భీష్ముడు రథం నుంచి పడిపోయాడు.', 'Padho roju saayantram, Bheeshmudu ratham nunchi *padipoyadu*.', { gap: 0.4 }),
  LN('bed', 'కానీ అతని శరీరం నేలను తాకలేదు! ఒంటి నిండా గుచ్చుకున్న బాణాలే, ఒక పరుపులా అతన్ని పట్టుకున్నాయి.', 'Kaani athani shareeram nelanu thaakaledu! Onti nindaa gucchukunna baanaale, oka *parupula* athanni pattukunnaayi.', { gap: 0.4 }),
  LN('stop', 'యుద్ధం ఆగిపోయింది. కౌరవులు, పాండవులు, అందరూ చుట్టూ నిలబడ్డారు.', 'Yuddham aagipoyindi. Kauravulu, Paandavulu, *andaroo* chuttoo nilabaddaru.'),
  LN('pillow', 'నా తల వేలాడుతోంది, అన్నాడు భీష్ముడు. అర్జునుడు మూడు బాణాలు వేసి, తలగడ చేశాడు.', 'Naa thala velaadutondi, annadu Bheeshmudu. Arjunudu *moodu baanaalu* vesi, thalagada chesadu.'),
  LN('thirst', 'దాహం వేసింది. అర్జునుడు భూమిలోకి ఒక బాణం వేశాడు!', '*Daaham* vesindi. Arjunudu bhoomiloki oka baanam veshadu!', { gap: 0.4 }),
  LN('water', 'భూమి నుంచి చల్లని నీటి ధార పైకి లేచింది. భీష్ముడి దాహం తీరింది.', 'Bhoomi nunchi challani *neeti dhaara* paiki lechindi. Bheeshmudi daaham theerindi.'),
  LN('wait', 'కోరుకున్నప్పుడే మరణం, అనే వరం ఉంది. అందుకే, ఉత్తరాయణం కోసం ఎదురుచూశాడు.', 'Korukunnappude maranam, ane varam undi. Anduke, *Uttharaayanam* kosam eduruchoosadu.'),
  LN('days', 'దాదాపు యాభై ఎనిమిది రాత్రులు, ఆ బాణాల పరుపు మీదే!', 'Daadaapu *yaabhai enimidi* raathrulu, aa baanaala parupu meede!', { gap: 0.4 }),
  LN('teach', 'ఆ సమయంలో, ధర్మరాజుకు రాజధర్మం బోధించాడు. విష్ణు సహస్రనామం కూడా, ఆ సందర్భంలోనే వచ్చింది.', 'Aa samayamlo, Dharmaraajuku raajadharmam bodhinchadu. *Vishnu Sahasranaamam* kooda, aa sandarbhamlone vacchindi.'),
  LN('sun', 'సూర్యుడు ఉత్తరం వైపు తిరిగిన రోజు, భీష్ముడు కళ్ళు మూశాడు.', 'Sooryudu uttharam vaipu thirigina roju, Bheeshmudu *kallu moosadu*.', { gap: 0.45 }),
  LN('ashtami', 'ఆ రోజునే ఇప్పటికీ, భీష్మ అష్టమిగా గుర్తు చేసుకుంటారు.', 'Aa rojune ippatiki, *Bheeshma Ashtami*ga gurthu chesukuntaaru.'),
  LN('source', 'ఇది మహాభారతం భీష్మ పర్వం, అనుశాసన పర్వాల్లో ఉన్న కథ.', 'Idi Mahabharatam *Bheeshma parvam*, Anushaasana parvaallo unna katha.'),
  LN('cta', 'ఇంకా ఇలాంటి కథల కోసం... ఫాలో అవ్వండి!', 'Inka ilaanti kathala kosam... *follow* avvandi!', { gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

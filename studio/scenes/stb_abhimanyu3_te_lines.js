// Abhimanyu Part 3/3 — the end, and Arjuna's vow. Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Mahabharata, Drona Parva (Abhimanyu-vadha + Pratijna parva + Jayadratha-vadha): bow, horses, charioteer gone; Drona breaks his sword, Karna his shield; he fights with a chariot wheel,
// then a mace; Dushasana's son rises first and strikes his head; Arjuna vows to kill Jayadratha before next sunset or enter fire; does so on the 14th day with Krishna's help. Parikshit = Abhimanyu's son.
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.3, ...o });
window.STB_LINES = [
  LN('recap', 'నిన్న చూశాం, ఆరుగురు మహారథులు అభిమన్యుడిని చుట్టుముట్టారు. విల్లు విరిగిపోయింది.', 'Ninna choosam, aaruguru maharathulu Abhimanyudini *chuttumuttaru*. Villu virigipoyindi.', { gap: 0.35 }),
  LN('lost', 'గుర్రాలు చనిపోయాయి, సారథి పడిపోయాడు. చేతిలో కత్తి, డాలు మాత్రమే!', 'Gurraalu chanipoyayi, saarathi padipoyadu. Chethilo *katthi*, daalu maatrame!'),
  LN('sword', 'ద్రోణుడు కత్తిని విరిచాడు. కర్ణుడు డాలును ముక్కలు చేశాడు.', 'Dronudu katthini virichadu. Karnudu *daalunu* mukkalu chesadu.'),
  LN('wheel', 'అయినా ఆగలేదు! విరిగిన రథ చక్రాన్నే ఆయుధంగా ఎత్తాడు!', 'Ayina aagaledu! Virigina *ratha chakraanne* aayudhanga ethadu!', { gap: 0.4 }),
  LN('vishnu', 'చక్రం తిప్పుతూ శత్రువుల మీదకి దూకాడు. చూసిన వాళ్ళకు, విష్ణువే చక్రంతో వచ్చినట్టు అనిపించింది!', 'Chakram thipputhu shatruvula meedaki dookadu. Choosina vaallaku, *Vishnuve* chakramtho vacchinattu anipinchindi!'),
  LN('shatter', 'కానీ బాణాల వర్షంతో, ఆ చక్రం కూడా ముక్కలైంది.', 'Kaani baanaala varshamtho, aa chakram kooda *mukkalaindi*.'),
  LN('mace', 'చివరికి గదతో, దుశ్శాసనుడి కొడుకుతో పోరాడాడు. ఇద్దరూ కింద పడ్డారు.', 'Chivariki *gadatho*, Dushshaasanudi kodukutho poraadadu. Iddaroo kinda paddaru.'),
  LN('blow', 'దుశ్శాసనుడి కొడుకు ముందు లేచాడు. లేస్తున్న అభిమన్యుడి తల మీద, గదతో కొట్టాడు.', 'Dushshaasanudi koduku mundu lechadu. Lesthunna Abhimanyudi thala meeda, *gadatho* kottadu.', { gap: 0.45 }),
  LN('fall', 'పదహారేళ్ళ వీరుడు, కురుక్షేత్రంలో నేలకొరిగాడు.', 'Padahaarella veerudu, Kurukshetramlo *nelakorigadu*.', { gap: 0.5 }),
  LN('return', 'ఆ సాయంత్రం అర్జునుడు తిరిగి వచ్చాడు. కొడుకు లేడని తెలిసి, కుప్పకూలిపోయాడు.', 'Aa saayantram Arjunudu thirigi vacchadu. Koduku ledani telisi, *kuppakoolipoyadu*.'),
  LN('learn', 'ద్వారం మూసింది జయద్రథుడు అని తెలిసింది. అర్జునుడు ప్రతిజ్ఞ చేశాడు!', 'Dwaaram moosindi *Jayadrathudu* ani telisindi. Arjunudu prathigna chesadu!'),
  LN('vow', 'రేపు సూర్యాస్తమయం లోపు జయద్రథుడిని చంపుతాను. లేకపోతే, నేనే అగ్నిలో దూకుతాను!', 'Repu *sooryaasthamayam* lopu Jayadrathudini champuthaanu. Lekapothe, nene agnilo dookuthaanu!', { gap: 0.45 }),
  LN('kept', 'మహాభారతం ద్రోణ పర్వం ప్రకారం, మరుసటి రోజు, కృష్ణుడి సహాయంతో, అర్జునుడు ఆ మాట నిలబెట్టుకున్నాడు.', 'Mahabharatam Drona parvam prakaaram, marusati roju, Krishnudi sahaayamtho, Arjunudu aa maata *nilabettukunnadu*.'),
  LN('heir', 'అభిమన్యుడి కొడుకు పరీక్షిత్తే, తర్వాత పాండవ వంశానికి రాజు అయ్యాడు.', 'Abhimanyudi koduku *Parikshitthe*, tarvaata Pandava vamshaaniki raaju ayyadu.'),
  LN('cta', 'ఇంకా ఇలాంటి కథల కోసం... ఫాలో అవ్వండి!', 'Inka ilaanti kathala kosam... *follow* avvandi!', { gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

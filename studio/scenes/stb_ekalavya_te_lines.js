// Ekalavya's thumb (Telugu, 2D puppet animation like the Karna reel). Narrator = Maddy's cloned voice (maddy2_te2).
// omni = Telugu script for the voice model; text = Tinglish subtitle of exactly what is spoken (*word* = yellow).
// Source: Mahabharata, Adi Parva (Sambhava Parva), the Ekalavya episode (KMG translation section 134 / BORI CE 1.123).
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.3, ...o });
window.STB_LINES = [
  LN('hook', 'ద్రోణుడు... ఏకలవ్యుడి బొటనవేలిని ఎందుకు అడిగాడు? ఒక్క పాఠం కూడా నేర్పకుండానే!', 'Dronudu... Ekalavyudi *botanaveli*ni enduku adigadu? Okka paatham kuda nerpakundane!', { gap: 0.45 }),
  LN('who', 'ఏకలవ్యుడు... నిషాద రాజు హిరణ్యధనుడి కొడుకు. అడవిలో పెరిగిన వేటగాడు.', 'Ekalavyudu... *Nishada* raju Hiranyadhanudi koduku. Adavilo perigina vetagaadu.'),
  LN('ask', 'విలువిద్య కోసం, ద్రోణుడి దగ్గరకు వచ్చాడు. కానీ ద్రోణుడు... నువ్వు నిషాదుడివి, నీకు నేర్పను! అన్నాడు.', 'Viluvidya kosam, Dronudi daggaraku vachhadu. Kaani Dronudu... nuvvu Nishadudivi, neeku *nerpanu*! annadu.', { gap: 0.4 }),
  LN('clay', 'ఏకలవ్యుడు ఆగలేదు. అడవిలో... మట్టితో ద్రోణుడి బొమ్మ చేశాడు. ఆ బొమ్మ ముందే, రోజూ సాధన!', 'Ekalavyudu aagaledu. Adavilo... mattito Dronudi *bomma* chesadu. Aa bomma munde, roju *saadhana*!'),
  LN('dog', 'ఒకరోజు పాండవులు, కౌరవులు వేటకు వచ్చారు. వాళ్ళ కుక్క... ఏకలవ్యుడిని చూసి మొరిగింది.', 'Okaroju Pandavulu, Kauravulu vetaku vachharu. Vaalla *kukka*... Ekalavyudini choosi morigindi.'),
  LN('seven', 'అంతే! ఒక్క క్షణంలో... ఏడు బాణాలు, ఆ కుక్క నోట్లోకి! దాని అరుపు ఆగిపోయింది.', 'Anthe! Okka kshanamlo... *edu baanaalu*, aa kukka notloki! Daani arupu aagipoyindi.', { gap: 0.4 }),
  LN('arjuna', 'అది చూసి అర్జునుడు షాక్ అయ్యాడు. నీ గురువు ఎవరు? అని అడిగితే... ద్రోణుడు! అన్నాడు ఏకలవ్యుడు.', 'Adi choosi Arjunudu shock ayyadu. Nee guruvu evaru? ani adigithe... *Dronudu*! annadu Ekalavyudu.', { gap: 0.4 }),
  LN('complain', 'అర్జునుడు గురువు దగ్గరకు వెళ్ళాడు. నాకంటే గొప్ప శిష్యుడు ఉండడు అన్నారు... మరి వాడెవడు?', 'Arjunudu guruvu daggaraku vellaadu. Naakante goppa sishyudu undadu annaru... mari *vaadevadu*?', { gap: 0.4 }),
  LN('visit', 'ద్రోణుడు అడవికి వచ్చాడు. ఏకలవ్యుడు కాళ్ళ మీద పడ్డాడు. గురువు గారూ... ఏం కావాలన్నా ఇస్తాను!', 'Dronudu adaviki vachhadu. Ekalavyudu kaalla meeda paddadu. Guruvu gaaru... em kaavaalanna *istaanu*!', { gap: 0.2 }),
  LN('demand', 'అయితే... నీ కుడి చేతి బొటనవేలు, నాకు దక్షిణగా ఇవ్వు!', 'Ayithe... nee kudi chethi *botanavelu*, naaku dakshinaga ivvu!', { gap: 0.5 }),
  LN('cut', 'ఏకలవ్యుడు ఒక్క క్షణం కూడా ఆలోచించలేదు. నవ్వుతూనే... బొటనవేలిని కోసి ఇచ్చేశాడు.', 'Ekalavyudu okka kshanam kuda alochinchaledu. Navvuthune... botanavelini *kosi* icchesadu.', { gap: 0.45 }),
  LN('why', 'ఎందుకంటే... అర్జునుడిని గొప్ప విలుకాడిని చేస్తానని, ద్రోణుడు మాట ఇచ్చాడు!', 'Endukante... Arjunudini goppa vilukaadini chestaanani, Dronudu *maata* icchadu!'),
  LN('end', 'ఆ తర్వాత... ఏకలవ్యుడి బాణాలకు ఆ వేగం మళ్ళీ రాలేదు. ఒక మాట కోసం... ఒక శిష్యుడి కల తెగిపోయింది.', 'Aa tarvaata... Ekalavyudi baanaalaku aa vegam malli raaledu. Oka maata kosam... oka sishyudi *kala* tegipoyindi.', { gap: 0.45 }),
  LN('cta', 'ఇంకా ఇలాంటి కథల కోసం... ఫాలో అవ్వండి!', 'Inka ilaanti kathala kosam... *follow* avvandi!', { gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

// Kumbhakarna: why he slept for six months. Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Valmiki Ramayana — Uttara Kanda (tapas with Ravana and Vibhishana; Brahma asks Saraswati to sit on his tongue; he asks for sleep for many years) and Yuddha Kanda
// (Brahma's six-months-sleep / one-day-awake, waking him with elephants and drums, he tells Ravana to return Sita, dies by Rama's arrows). "Indrasana -> Nidrasana" wordplay is a later telling: "konni kathala prakaaram".
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.3, ...o });
window.STB_LINES = [
  LN('hook', 'ఆరు నెలలు నిద్ర, ఒక్క రోజే మెలకువ! కుంభకర్ణుడికి ఈ శాపం ఎలా వచ్చింది?', 'Aaru nelalu nidra, okka roje melakuva! *Kumbhakarnudiki* ee shaapam ela vacchindi?', { gap: 0.35 }),
  LN('who', 'రావణుడి తమ్ముడు కుంభకర్ణుడు, పుట్టినప్పటి నుంచే ఒక రాక్షస పర్వతం!', 'Raavanudi thammudu Kumbhakarnudu, puttinappati nunche oka rakshasa *parvatham*!'),
  LN('hunger', 'అతని ఆకలికి, అడవులు ఖాళీ అయ్యాయి, ఋషులు భయపడ్డారు.', 'Athani *aakaliki*, adavulu khaali ayyayi, rushulu bhayapaddaru.'),
  LN('tapas', 'రావణుడు, విభీషణుడితో కలిసి, అతను బ్రహ్మ కోసం ఘోర తపస్సు చేశాడు.', 'Raavanudu, Vibheeshanuditho kalisi, athanu *Brahma* kosam ghora tapassu chesadu.'),
  LN('fear', 'బ్రహ్మ ప్రత్యక్షమయ్యాడు. దేవతలు వణికిపోయారు. ఇతను వరం అడిగితే, లోకమే మిగలదు!', 'Brahma prathyakshamayyadu. Devathalu *vanikipoyaru*. Ithanu varam adigithe, lokame migaladu!', { gap: 0.4 }),
  LN('saraswati', 'అప్పుడు బ్రహ్మ, సరస్వతీ దేవిని పిలిచాడు.', 'Appudu Brahma, *Saraswathi devini* pilichadu.'),
  LN('tongue', 'సరస్వతి, కుంభకర్ణుడి నాలుక మీద కూర్చుంది!', 'Saraswathi, Kumbhakarnudi *naaluka* meeda koorchundi!', { gap: 0.4 }),
  LN('ask', 'వాల్మీకి రామాయణం ఉత్తర కాండ ప్రకారం, అతను అడిగింది, ఎన్నో సంవత్సరాలు నిద్రపోవాలి!', 'Valmiki Ramayanam *Utthara kaanda* prakaaram, athanu adigindi, enno samvathsaraalu nidrapovaali!'),
  LN('pun', 'కొన్ని కథల ప్రకారం, ఇంద్రాసనం అడగాలనుకున్నాడు, నోట్లో నుంచి నిద్రాసనం వచ్చింది!', 'Konni kathala prakaaram, *Indraasanam* adagaalanukunnadu, notlo nunchi Nidraasanam vacchindi!', { gap: 0.4 }),
  LN('sleep', 'బ్రహ్మ తథాస్తు అన్నాడు. కుంభకర్ణుడు, నిద్రలోకి జారిపోయాడు.', 'Brahma *thathaasthu* annadu. Kumbhakarnudu, nidraloki jaaripoyadu.'),
  LN('plead', 'రావణుడు బ్రహ్మను బతిమాలాడు. అప్పుడు బ్రహ్మ మార్చాడు, ఆరు నెలలు నిద్ర, ఒక్క రోజు మెలకువ.', 'Raavanudu Brahmanu bathimaaladu. Appudu Brahma maarchadu, *aaru nelalu* nidra, okka roju melakuva.'),
  LN('wake', 'రామ రావణ యుద్ధంలో, అతన్ని నిద్ర లేపడానికి, ఏనుగులు అతని మీద నడిచాయి! డప్పులు మోగాయి!', 'Rama Raavana yuddhamlo, athanni nidra lepadaaniki, *enugulu* athani meeda nadichayi! Dappulu mogaayi!'),
  LN('advice', 'లేచిన కుంభకర్ణుడు, సీతను తిరిగి ఇచ్చేయ్ అని రావణుడికే చెప్పాడు. అయినా అన్న కోసం యుద్ధానికి వెళ్ళాడు.', 'Lechina Kumbhakarnudu, Seethanu thirigi icchey ani Raavanudike cheppadu. Ayina *anna kosam* yuddhaaniki velladu.'),
  LN('end', 'చివరికి, శ్రీరాముడి బాణాలకు నేలకొరిగాడు.', 'Chivariki, *Sriramudi* baanaalaku nelakorigadu.'),
  LN('cta', 'ఇంకా ఇలాంటి కథల కోసం... ఫాలో అవ్వండి!', 'Inka ilaanti kathala kosam... *follow* avvandi!', { gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

// Bhishma Part 2/3 — Amba's revenge and Shikhandi. Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Mahabharata, Udyoga Parva (Ambopakhyana): Bhishma takes the Kashi princesses Amba, Ambika, Ambalika for Vichitravirya; Amba loved Shalva, who rejects her; Bhishma will not marry her (his vow);
// Parashurama fights Bhishma (23 days) and stops; Amba's tapas, Shiva's boon that she will cause his death in her next birth; she enters the fire; reborn as Shikhandi, child of Drupada.
// Bhishma Parva: Bhishma will not fight Shikhandi; on the 10th day Arjuna shoots from behind Shikhandi.
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.3, ...o });
window.STB_LINES = [
  LN('recap', 'నిన్న చూశాం, దేవవ్రతుడు భీష్ముడు అయ్యాడు. ఇవాళ, అతని మరణానికి కారణమైన ఒక స్త్రీ కథ!', 'Ninna choosam, Devavrathudu Bheeshmudu ayyadu. Ivaala, athani maranaaniki kaaranamaina oka *sthree* katha!', { gap: 0.35 }),
  LN('kashi', 'తమ్ముడు విచిత్రవీర్యుడి కోసం, భీష్ముడు కాశీ రాకుమార్తెలను తీసుకొచ్చాడు. అంబ, అంబిక, అంబాలిక.', 'Thammudu Vichithraveeryudi kosam, Bheeshmudu *Kaasi* raakumaarthelanu theesukocchadu. Amba, Ambika, Ambaalika.'),
  LN('love', 'కానీ అంబ అంది, నేను సాల్వ రాజును ప్రేమించాను!', 'Kaani Amba andi, nenu *Saalva* raajunu preminchaanu!'),
  LN('reject', 'భీష్ముడు ఆమెను పంపించేశాడు. కానీ సాల్వుడు అన్నాడు, వేరేవాడు తీసుకెళ్ళిన దాన్ని, నేను ఒప్పుకోను!', 'Bheeshmudu aamenu pampinchesadu. Kaani Saalvudu annadu, verevaadu theesukellina daanni, nenu *oppukonu*!', { gap: 0.4 }),
  LN('back', 'అంబ తిరిగి వచ్చింది. నన్ను నువ్వే పెళ్ళి చేసుకో, అని భీష్ముడిని అడిగింది.', 'Amba thirigi vacchindi. Nannu *nuvve* pelli chesuko, ani Bheeshmudini adigindi.'),
  LN('no', 'కానీ తన ప్రతిజ్ఞ కోసం, భీష్ముడు కాదన్నాడు.', 'Kaani thana prathigna kosam, Bheeshmudu *kaadannadu*.', { gap: 0.4 }),
  LN('parashu', 'అంబ పరశురాముడి దగ్గరకు వెళ్ళింది. గురువు, శిష్యుడు, ఇరవై మూడు రోజులు యుద్ధం చేశారు!', 'Amba *Parashuraamudi* daggaraku vellindi. Guruvu, shishyudu, iravai moodu rojulu yuddham chesaaru!'),
  LN('draw', 'ఎవరూ ఓడలేదు. చివరికి యుద్ధం ఆగిపోయింది.', 'Evaru odaledu. Chivariki yuddham *aagipoyindi*.'),
  LN('tapas', 'అంబ ఘోర తపస్సు చేసింది. శివుడు ప్రత్యక్షమై వరం ఇచ్చాడు. వచ్చే జన్మలో, భీష్ముడి మరణానికి నువ్వే కారణం!', 'Amba ghora tapassu chesindi. Shivudu prathyakshamai varam icchadu. Vacche janmalo, Bheeshmudi maranaaniki *nuvve* kaaranam!', { gap: 0.4 }),
  LN('fire', 'ఆ జన్మ కోసం, అంబ అగ్నిలోకి ప్రవేశించింది.', 'Aa janma kosam, Amba *agniloki* praveshinchindi.', { gap: 0.4 }),
  LN('reborn', 'ద్రుపద రాజు ఇంట్లో, శిఖండిగా మళ్ళీ పుట్టింది.', 'Drupada raaju intlo, *Shikhandiga* malli puttindi.'),
  LN('war', 'కురుక్షేత్రంలో, శిఖండి మీద భీష్ముడు బాణం వేయడు. ఎందుకంటే, అది ఒకప్పటి అంబ అని అతనికి తెలుసు.', 'Kurukshetramlo, Shikhandi meeda Bheeshmudu baanam veyadu. Endukante, adi okappati *Amba* ani athaniki telusu.'),
  LN('tenth', 'మహాభారతం ప్రకారం, పదో రోజు, శిఖండి వెనక నుంచి, అర్జునుడు బాణాలు వేశాడు!', 'Mahabharatam prakaaram, *padho roju*, Shikhandi venaka nunchi, Arjunudu baanaalu veshadu!', { gap: 0.4 }),
  LN('cta', 'మరి భీష్ముడు ఎలా పడ్డాడు? మిగతా కథ రేపు, పార్ట్ త్రీ లో. ఫాలో అవ్వండి!', 'Mari Bheeshmudu ela paddadu? Migatha katha repu, *Part 3* lo. Follow avvandi!', { gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

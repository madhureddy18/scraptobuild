// Bhishma Part 1/3 — Devavrata becomes Bhishma. Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Mahabharata, Adi Parva (Sambhava Parva): Devavrata = son of Shantanu and Ganga; Shantanu loves Satyavati; her father (the fisher-chief) demands her son be king;
// Devavrata gives up the throne and vows lifelong celibacy; the heavens rain flowers and call him "Bhishma"; Shantanu grants him death only when he wishes (iccha mrityu).
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.3, ...o });
window.STB_LINES = [
  LN('hook', 'ఒక్క ప్రతిజ్ఞ వల్ల, ఒక రాజకుమారుడు రాజ్యం, పెళ్ళి, అన్నీ వదిలేశాడు! ఎవరతను?', 'Okka *prathigna* valla, oka raajakumaarudu raajyam, pelli, anni vadilesadu! Evarathanu?', { gap: 0.35 }),
  LN('who', 'గంగాదేవి, శంతన మహారాజుల కొడుకు, దేవవ్రతుడు.', 'Gangaadevi, Shanthana mahaaraajula koduku, *Devavrathudu*.'),
  LN('prince', 'గొప్ప విలుకాడు, గొప్ప జ్ఞాని. హస్తినాపురానికి కాబోయే రాజు!', 'Goppa vilukaadu, goppa gnaani. *Hasthinaapuraaniki* kaaboye raaju!'),
  LN('river', 'ఒకరోజు శంతనుడు యమునా తీరంలో, సత్యవతిని చూశాడు. ఆమెను ప్రేమించాడు.', 'Okaroju Shanthanudu Yamunaa theeramlo, *Satyavathini* choosadu. Aamenu preminchadu.'),
  LN('cond', 'కానీ ఆమె తండ్రి ఒక షరతు పెట్టాడు. నా కూతురి కొడుకే, రాజు కావాలి!', 'Kaani aame thandri oka *sharathu* pettadu. Naa koothuri koduke, raaju kaavaali!', { gap: 0.4 }),
  LN('sad', 'కొడుకుకు అన్యాయం చేయలేక, శంతనుడు మౌనంగా బాధపడ్డాడు.', 'Kodukuku anyaayam cheyaleka, Shanthanudu *mounanga* baadhapaddadu.'),
  LN('learn', 'తండ్రి బాధ తెలుసుకున్న దేవవ్రతుడు, స్వయంగా ఆ బెస్త రాజు దగ్గరకు వెళ్ళాడు.', 'Thandri baadha telusukunna Devavrathudu, swayanga aa *bestha raaju* daggaraku velladu.'),
  LN('throne', 'నేను రాజ్యం వదులుకుంటాను. సత్యవతి కొడుకే రాజు!', 'Nenu raajyam *vadulukuntaanu*. Satyavathi koduke raaju!', { gap: 0.4 }),
  LN('doubt', 'మరి నీ పిల్లలు రేపు రాజ్యం అడిగితే? అని బెస్త రాజు అడిగాడు.', 'Mari nee pillalu repu raajyam adigithe? ani bestha raaju *adigadu*.'),
  LN('vow', 'అప్పుడు దేవవ్రతుడు ప్రతిజ్ఞ చేశాడు. జీవితాంతం, నేను పెళ్ళి చేసుకోను!', 'Appudu Devavrathudu prathigna chesadu. *Jeevithaantham*, nenu pelli chesukonu!', { gap: 0.45 }),
  LN('flowers', 'ఆకాశం నుంచి పూల వర్షం కురిసింది. దేవతలు అన్నారు, భీష్ముడు!', 'Aakaasam nunchi *poola varsham* kurisindi. Devathalu annaru, Bheeshmudu!', { gap: 0.4 }),
  LN('meaning', 'భీష్ముడు అంటే, భయంకరమైన ప్రతిజ్ఞ చేసినవాడు.', '*Bheeshmudu* ante, bhayankaramaina prathigna chesinavaadu.'),
  LN('boon', 'సంతోషించిన శంతనుడు వరం ఇచ్చాడు. నువ్వు కోరుకున్నప్పుడే, నీకు మరణం!', 'Santhoshinchina Shanthanudu varam icchadu. Nuvvu korukunnappude, neeku *maranam*!', { gap: 0.4 }),
  LN('source', 'మహాభారతం ఆది పర్వంలో ఉన్న కథ ఇది. కానీ ఈ ప్రతిజ్ఞే, తర్వాత ఎన్నో కష్టాలకు కారణమైంది.', 'Mahabharatam *Aadi parvamlo* unna katha idi. Kaani ee prathigne, tarvaata enno kashtaalaku kaaranamaindi.'),
  LN('cta', 'మిగతా కథ రేపు, పార్ట్ టూ లో. ఫాలో అవ్వండి!', 'Migatha katha repu, *Part 2* lo. Follow avvandi!', { gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

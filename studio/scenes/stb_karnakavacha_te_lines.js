// Karna's kavacha-kundalas: why he cut them off and gave them to Indra. Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Mahabharata, Vana Parva (Kundalaharana Parva, KMG sections 300-310): Karna born with armour + earrings from Surya; Surya warns him in a dream that Indra will come
// as a brahmin to beg them (to help his son Arjuna); Karna won't refuse a gift; Surya tells him to ask for Indra's infallible Shakti in exchange; Indra comes while Karna worships
// the sun; Karna cuts the armour from his body without flinching -> named Vaikartana; Indra gives the Shakti, usable once on one enemy. Drona Parva: used on Ghatotkacha.
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.22, ...o });
window.STB_LINES = [
  LN('hook', 'కర్ణుడు పుట్టుకతోనే... ఎవరూ చీల్చలేని కవచం, కుండలాలతో పుట్టాడు. మరి వాటిని తనే, ఎందుకు కోసి ఇచ్చేశాడు?', 'Karnudu puttukathone... evaru cheelchaleni *kavacham*, kundalaalatho puttaadu. Mari vaatini thane, enduku kosi ichesaadu?', { gap: 0.3 }),
  LN('boon', 'అవి సూర్య భగవానుడు ఇచ్చిన వరం. అవి ఉన్నంత కాలం... కర్ణుడిని ఎవరూ చంపలేరు.', 'Avi *Surya* bhagavaanudu ichina varam. Avi unnantha kaalam... Karnudini evaru champaleru.'),
  LN('indra', 'కానీ ఇది... దేవేంద్రుడిని భయపెట్టింది. ఎందుకంటే, యుద్ధంలో కర్ణుడి ఎదురు... తన కొడుకు అర్జునుడు!', 'Kaani idi... *Indrudini* bhayapettindi. Endukante, yuddhamlo Karnudi eduru... thana koduku Arjunudu!', { gap: 0.3 }),
  LN('dream', 'ఒక రాత్రి, సూర్యుడు కర్ణుడి కలలో కనిపించాడు.', 'Oka raatri, Suryudu Karnudi *kalalo* kanipinchaadu.'),
  LN('warn', 'కర్ణా! రేపు ఇంద్రుడు, బ్రాహ్మణుడి వేషంలో వస్తాడు. నీ కవచం అడుగుతాడు... ఇవ్వొద్దు!', 'Karnaa! Repu Indrudu, *braahmanudi* veshamlo vasthaadu. Nee kavacham adugutaadu... ivvoddu!', { gap: 0.3 }),
  LN('refuse', 'కర్ణుడు నవ్వాడు. నా దగ్గరికి వచ్చి అడిగిన వాళ్ళకి... నేను ఎప్పుడూ, లేదు అని చెప్పను!', 'Karnudu navvaadu. Naa daggariki vachi adigina vaallaki... nenu eppudu, *ledu* ani cheppanu!', { gap: 0.3 }),
  LN('advice', 'సరే. అయితే, బదులుగా ఇంద్రుడి శక్తి ఆయుధం అడుగు, అన్నాడు సూర్యుడు.', 'Sare. Aithe, baduluga Indrudi *Shakti* aayudham adugu, annaadu Suryudu.'),
  LN('noon', 'తర్వాతి రోజు మధ్యాహ్నం. కర్ణుడు నదిలో నిలబడి, సూర్యుడికి పూజ చేస్తున్నాడు.', 'Tharvaathi roju *madhyaahnam*. Karnudu nadilo nilabadi, Suryudiki pooja chesthunnaadu.'),
  LN('beg', 'అప్పుడే ఒక ముసలి బ్రాహ్మణుడు వచ్చాడు. బాబూ... నీ కవచ కుండలాలు, నాకు దానం చెయ్యి!', 'Appude oka musali braahmanudu vachaadu. Baabu... nee kavacha *kundalaalu*, naaku daanam cheyyi!', { gap: 0.3 }),
  LN('cut', 'కర్ణుడు ఒక్క క్షణం కూడా ఆలోచించలేదు. కత్తి తీసి... తన శరీరానికి అతుక్కున్న కవచాన్ని, కోసేశాడు!', 'Karnudu okka kshanam kuda alochinchaledu. Katthi theesi... thana shareeraaniki athukkunna kavachaanni, *kosesaadu*!', { gap: 0.3 }),
  LN('smile', 'రక్తం కారుతున్నా... ముఖంలో నవ్వు మాత్రం పోలేదు. అందుకే అతనికి, వైకర్తనుడు అనే పేరు వచ్చింది.', 'Raktham kaaruthunna... mukhamlo *navvu* maatram poledu. Anduke athaniki, Vaikarthanudu ane peru vachindi.'),
  LN('shakti', 'ఇంద్రుడు సిగ్గుపడ్డాడు. శక్తి ఆయుధం ఇచ్చాడు, కానీ... ఒక్కసారి మాత్రమే వాడాలి అనే షరతుతో!', 'Indrudu siggupaddaadu. Shakti aayudham ichaadu, kaani... *okkasaari* maatrame vaadaali ane sharathutho!'),
  LN('ghat', 'ఆ ఒక్క శక్తి... తర్వాత కురుక్షేత్రంలో, ఘటోత్కచుడి మీద వాడాల్సి వచ్చింది. అర్జునుడు బతికిపోయాడు!', 'Aa okka shakti... tharvaatha Kurukshetramlo, *Ghatothkachudi* meeda vaadaalsi vachindi. Arjunudu brathikipoyaadu!', { gap: 0.3 }),
  LN('end', 'తన ప్రాణం కాపాడే కవచాన్నే, దానం చేశాడు... అందుకే అతను, దానవీర శూర కర్ణుడు!', 'Thana praanam kaapaade kavachaanne, daanam chesaadu... anduke athanu, *Daana Veera* Shoora Karnudu!', { gap: 0.3 }),
  LN('cta', 'ఇంకా ఇలాంటి కథల కోసం... ఫాలో అవ్వండి!', 'Inka ilaanti kathala kosam... *follow* avvandi!', { gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

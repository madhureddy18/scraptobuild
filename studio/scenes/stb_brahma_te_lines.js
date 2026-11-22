// Why is Brahma rarely worshipped? Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Padma Purana (Srishti Khanda) — Brahma's yajna at Pushkar, Savitri is late, Brahma marries Gayatri for the ritual, Savitri curses that he be worshipped only at Pushkar.
// Shiva Purana (Vidyeshvara Samhita) — the pillar of fire; Brahma lies with the Ketaki flower; Shiva says he will not be worshipped. Pushkar's Brahma temple (Rajasthan) is the famous one.
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.3, ...o });
window.STB_LINES = [
  LN('hook', 'సృష్టి చేసిన బ్రహ్మకు, ఎందుకు దాదాపు గుడులే లేవు?', 'Srushti chesina *Brahmaku*, enduku daadaapu gudule levu?', { gap: 0.35 }),
  LN('lotus', 'పద్మ పురాణం ప్రకారం, బ్రహ్మ చేతిలోని తామర పువ్వు, భూమి మీద పడింది.', '*Padma Puraanam* prakaaram, Brahma chethiloni thaamara puvvu, bhoomi meeda padindi.'),
  LN('lake', 'అది పడిన చోట, ఒక సరస్సు పుట్టింది. అదే పుష్కర్!', 'Adi padina chota, oka sarassu puttindi. Ade *Pushkar*!'),
  LN('yagna', 'అక్కడ బ్రహ్మ ఒక గొప్ప యజ్ఞం మొదలుపెట్టాడు. దేవతలంతా వచ్చారు.', 'Akkada Brahma oka goppa *yagnam* modalupettadu. Devathalantha vaccharu.'),
  LN('late', 'కానీ యజ్ఞానికి భార్య కావాలి. బ్రహ్మ భార్య సావిత్రి, ఇంకా రాలేదు!', 'Kaani yagnaaniki bhaarya kaavaali. Brahma bhaarya *Saavithri*, inka raaledu!', { gap: 0.4 }),
  LN('time', 'ముహూర్తం దాటిపోతోంది. అప్పుడు బ్రహ్మ, గాయత్రి అనే అమ్మాయిని పెళ్ళి చేసుకున్నాడు.', 'Muhoortham daatipothondi. Appudu Brahma, *Gaayathri* ane ammaayini pelli chesukunnadu.'),
  LN('arrive', 'యజ్ఞం మొదలైంది. అప్పుడే సావిత్రి వచ్చింది. తన స్థానంలో, ఇంకొకరు!', 'Yagnam modalaindi. Appude Saavithri vacchindi. Thana sthaanamlo, *inkokaru*!', { gap: 0.4 }),
  LN('curse', 'కోపంతో శపించింది. నిన్ను ఈ పుష్కర్ లో తప్ప, భూమి మీద ఎక్కడా ఎవరూ పూజించరు!', 'Kopamtho shapinchindi. Ninnu ee Pushkar lo thappa, bhoomi meeda *ekkadaa* evaru poojincharu!', { gap: 0.4 }),
  LN('hill', 'తర్వాత సావిత్రి, అక్కడి కొండ మీదకి వెళ్ళిపోయింది. ఇప్పటికీ అక్కడ, సావిత్రి గుడి ఉంది.', 'Tarvaata Saavithri, akkadi konda meedaki vellipoyindi. Ippatiki akkada, *Saavithri gudi* undi.'),
  LN('pillar', 'శివ పురాణంలో ఇంకో కథ ఉంది. అంతులేని ఒక అగ్ని స్తంభం!', '*Shiva Puraanamlo* inko katha undi. Anthuleni oka agni sthambham!'),
  LN('race', 'దాని చివర ఎవరు చూస్తారో, అని బ్రహ్మ పైకి, విష్ణువు కిందకి వెళ్ళారు.', 'Daani chivara evaru choosthaaro, ani Brahma *paiki*, Vishnuvu kindaki vellaaru.'),
  LN('lie', 'బ్రహ్మ చివర చూడలేదు. కానీ, చూశాను అని అబద్ధం చెప్పాడు. మొగలి పువ్వు సాక్ష్యం చెప్పింది.', 'Brahma chivara choodaledu. Kaani, choosaanu ani *abaddham* cheppadu. Mogali puvvu saakshyam cheppindi.', { gap: 0.4 }),
  LN('shiva', 'శివుడు ఆగ్రహించాడు. ఇక నుంచి నీకు, పూజలు ఉండవు!', 'Shivudu aagrahinchadu. Ika nunchi neeku, *poojalu* undavu!', { gap: 0.4 }),
  LN('today', 'అందుకే ఇవాళ, రాజస్థాన్ లోని పుష్కర్ బ్రహ్మ ఆలయం, అంత ప్రత్యేకం!', 'Anduke ivaala, Rajasthan loni *Pushkar* Brahma aalayam, antha prathyekam!'),
  LN('cta', 'ఇంకా ఇలాంటి కథల కోసం... ఫాలో అవ్వండి!', 'Inka ilaanti kathala kosam... *follow* avvandi!', { gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

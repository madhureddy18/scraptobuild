// Barbarika — the warrior who could end Kurukshetra in a minute (Telugu daily reel, 2D puppet animation like the Karna reel). Narrator = Maddy's cloned voice (maddy2_te2).
// omni = Telugu script for the voice model; text = Tinglish subtitle of exactly what is spoken (*word* = yellow).
// Source: Skanda Purana (Maheshvara Khanda, Kaumarika Khanda) names Barbarika, son of Ghatotkacha; the three arrows, peepal-leaf test,
// "fight for the losing side" vow and the head watching the war are folk / Khatu Shyam (Rajasthan) tradition — said as "konni kathala prakaaram".
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.3, ...o });
window.STB_LINES = [
  LN('hook', 'కురుక్షేత్ర యుద్ధాన్ని... ఒక్క నిమిషంలో ముగించగల వీరుడు ఉన్నాడు! మరి అతను ఎందుకు యుద్ధం చేయలేదు?', 'Kurukshetra yuddhaanni... okka *nimishamlo* muginchagala veerudu unnadu! Mari athanu enduku yuddham cheyyaledu?', { gap: 0.35 }),
  LN('who', 'అతని పేరు బర్బరీకుడు. భీముడి మనవడు... ఘటోత్కచుడి కొడుకు.', 'Athani peru *Barbareekudu*. Bheemudi manavadu... Ghatotkachudi koduku.'),
  LN('boon', 'చిన్నప్పటి నుంచే తపస్సు చేసి, దేవతల నుంచి... మూడు దివ్య బాణాలు పొందాడు!', 'Chinnappati nunche tapassu chesi, devathala nunchi... *moodu* divya baanaalu pondadu!'),
  LN('power', 'ఒక్క బాణం... గురి పెట్టిన వాటన్నిటినీ గుర్తు పెడుతుంది. ఇంకో బాణం... వాటన్నిటినీ నాశనం చేసి, తిరిగి వస్తుంది!', 'Okka baanam... guri pettina vaatannitini gurthu pedutundi. Inko baanam... vaatannitini *naasanam* chesi, tirigi vastundi!', { gap: 0.4 }),
  LN('vow', 'యుద్ధానికి బయలుదేరుతూ, తల్లికి మాట ఇచ్చాడు... ఓడిపోతున్న వైపే, నేను పోరాడతాను!', 'Yuddhaaniki bayaluderuthu, thalliki maata icchadu... *odipothunna* vaipe, nenu poradathaanu!', { gap: 0.4 }),
  LN('brahmin', 'దారిలో ఒక బ్రాహ్మణుడు అతన్ని ఆపాడు. ఆ బ్రాహ్మణుడు ఎవరో కాదు... శ్రీకృష్ణుడు!', 'Daarilo oka braahmanudu athanni aapadu. Aa braahmanudu evaro kaadu... *Srikrishnudu*!', { gap: 0.4 }),
  LN('test', 'ఈ రావి చెట్టు ఆకులన్నీ, ఒకే బాణంతో గుచ్చగలవా? అని అడిగాడు కృష్ణుడు.', 'Ee *raavi chettu* aakulanni, oke baanamtho guchhagalava? ani adigadu Krishnudu.'),
  LN('leaf', 'బాణం అన్ని ఆకులకూ రంధ్రం చేసింది. తర్వాత... కృష్ణుడి కాలి చుట్టూ తిరిగింది! ఆయన కాలి కింద, ఒక ఆకు దాచాడు.', 'Baanam anni aakulaku randhram chesindi. Tarvaata... Krishnudi *kaali* chuttu tirigindi! Aayana kaali kinda, oka aaku daachadu.', { gap: 0.4 }),
  LN('danger', 'కృష్ణుడికి అర్థమైంది. ఓడేవాళ్ళ వైపు మారుతూ ఉంటే... చివరికి అతను తప్ప, ఎవరూ మిగలరు!', 'Krishnudiki arthamaindi. Odevaalla vaipu maaruthu unte... chivariki athanu thappa, *evaru migalaru*!', { gap: 0.4 }),
  LN('demand', 'అందుకే కృష్ణుడు దానం అడిగాడు... నీ తల, నాకు ఇవ్వు!', 'Anduke Krishnudu daanam adigadu... nee *thala*, naaku ivvu!', { gap: 0.45 }),
  LN('give', 'బర్బరీకుడు నవ్వాడు. నాకు ఒకటే కోరిక, ఈ యుద్ధం మొత్తం చూడాలి! ఆ తర్వాత తన తలను దానం ఇచ్చేశాడు.', 'Barbareekudu navvadu. Naaku okate korika, ee yuddham mottham *choodaali*! Aa tarvaata thana thalanu daanam icchesadu.', { gap: 0.4 }),
  LN('hill', 'ఆ తలను కొండ మీద పెట్టారు. అక్కడి నుంచే... పద్దెనిమిది రోజుల యుద్ధం మొత్తం చూశాడు.', 'Aa thalanu konda meeda pettaru. Akkadi nunche... *padhenimidi* rojula yuddham mottham choosadu.', { gap: 0.35 }),
  LN('source', 'బర్బరీకుడి పేరు స్కంద పురాణంలో ఉంది. ఈ కథ, కొన్ని కథల ప్రకారం. ఇవాళ రాజస్థాన్‌లో ఆయనను, ఖాటూ శ్యామ్ అని పూజిస్తారు!', 'Barbareekudi peru Skanda Puranamlo undi. Ee katha, konni kathala prakaaram. Ivaala Rajasthan lo aayananu, *Khatu Shyam* ani poojistaaru!', { gap: 0.35 }),
  LN('cta', 'ఇంకా ఇలాంటి కథల కోసం... ఫాలో అవ్వండి!', 'Inka ilaanti kathala kosam... *follow* avvandi!', { gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

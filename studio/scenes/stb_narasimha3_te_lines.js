// Narasimha Part 3/3 — the pillar, at dusk, on the threshold (Telugu daily reel, batch 22 Nov 2026). Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Bhagavata Purana, Canto 7 ch. 8-9 ("is He in this pillar?"; Narasimha bursts from the pillar, neither man nor animal; at the doorway (threshold), at dusk, on his lap, with his nails; the devas and Lakshmi cannot calm him, Brahma sends Prahlada, Narasimha places his hand on Prahlada's head). Series Narasimha 3/3.
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.45, ...o });
window.STB_LINES = [
  LN("recap", "నిన్న చూశాం... ఎన్ని చేసినా, ప్రహ్లాదుడు చావలేదు.", "Ninna choosaam... enni chesinaa, *Prahlaadudu* chaavaledu."),
  LN("roar", "హిరణ్యకశిపుడు గర్జించాడు. ఎవరి బలంతో, నువ్వు నన్ను ఎదిరిస్తున్నావు?", "Hiranyakashipudu *garjinchaadu*. Evari balamtho, nuvvu nannu edhiristhunnaavu?"),
  LN("every", "నారాయణుడు అంతటా ఉన్నాడు నాన్నా. నీలో, నాలో, అన్నిటిలో!", "Naaraayanudu *anthataa* unnaadu naannaa. Neelo, naalo, annitilo!"),
  LN("pillar", "అయితే... ఈ స్తంభంలో ఉన్నాడా?", "Aithe... ee *sthambhamlo* unnaadaa?"),
  LN("yes", "ఉన్నాడు నాన్నా!", "*Unnaadu* naannaa!"),
  LN("strike", "హిరణ్యకశిపుడు, ఆ స్తంభాన్ని బలంగా కొట్టాడు!", "Hiranyakashipudu, aa sthambhaanni *balamgaa* kottaadu!"),
  LN("burst", "భయంకరమైన గర్జన! స్తంభం పగిలి, సగం మనిషి, సగం సింహం... నరసింహుడు బయటకు వచ్చాడు!", "Bhayankaramaina garjana! Sthambham pagili, sagam manishi, sagam simham... *Narasimhudu* bayataku vachaadu!"),
  LN("door", "మనిషీ కాదు, జంతువూ కాదు. అతన్ని ఎత్తుకుని, గుమ్మం దగ్గరకు తీసుకెళ్ళాడు.", "Manishee kaadu, janthuvoo kaadu. Athanni etthukuni, *gummam* daggaraku theesukellaadu."),
  LN("dusk", "ఇంట్లోనూ కాదు, బయటా కాదు. సరిగ్గా సంధ్యా సమయం. పగలూ కాదు, రాత్రీ కాదు.", "Intlonoo kaadu, bayataa kaadu. Sarigga *sandhyaa* samayam. Pagaloo kaadu, raathree kaadu."),
  LN("lap", "తన ఒడిలో పడుకోబెట్టాడు. భూమీ కాదు, ఆకాశమూ కాదు.", "Thana *odilo* padukobettaadu. Bhoomee kaadu, aakaashamoo kaadu."),
  LN("nails", "ఏ ఆయుధమూ కాదు. తన గోళ్ళతో, హిరణ్యకశిపుడిని చీల్చేశాడు!", "Ye aayudhamoo kaadu. Thana *gollatho*, Hiranyakashipudini cheelchesaadu!"),
  LN("calm", "ఆయన కోపం ఎవరికీ తగ్గలేదు. చివరికి, చిన్న ప్రహ్లాదుడే వెళ్ళి, ఆయన పాదాల దగ్గర కూర్చున్నాడు.", "Aayana kopam evarikee thaggaledu. Chivariki, chinna *Prahlaadude* velli, aayana paadaala daggara koorchunnaadu."),
  LN("soft", "స్వామి చేయి అతని తల మీద పెట్టాడు. కోపం కరిగి, కరుణగా మారింది.", "Swaami cheyi athani thala meeda pettaadu. Kopam karigi, *karunagaa* maarindi."),
  LN("end", "నిజమైన భక్తి ఉంటే... దేవుడు స్తంభంలో నుంచి కూడా వస్తాడు!", "Nijamaina *bhakthi* unte... devudu sthambhamlo nunchi kuda vasthaadu!"),
  LN("cta", "ఇంకా ఇలాంటి కథల కోసం... ఫాలో అవ్వండి!", "Inka ilaanti kathala kosam... *follow* avvandi!"),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

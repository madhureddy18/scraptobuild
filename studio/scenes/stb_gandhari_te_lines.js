// Why did Gandhari blindfold herself for life? (Telugu daily reel, batch 22 Nov 2026). Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Mahabharata, Adi Parva (Sambhava parva: Gandhari worships Shiva, boon of 100 sons; Bhishma asks for her for Dhritarashtra; she learns he is blind and bandages her eyes with a cloth folded many times, resolving not to surpass her husband); Stri Parva (she glances from under the blindfold at Yudhishthira's toes, his nails turn dark; she curses Krishna that his race will perish in the 36th year).
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.5, ...o });
window.STB_LINES = [
  LN("hook", "కళ్ళు ఉన్నా, జీవితాంతం కళ్ళకు గంతలు కట్టుకుంది ఒక రాణి! ఎందుకు?", "Kallu unna, jeevithaantham kallaku *ganthalu* kattukundi oka raani! Enduku?"),
  LN("who", "ఆమె గాంధార రాకుమారి, గాంధారి. శివుడి భక్తురాలు, ఎంతో అందమైనది.", "Aame Gaandhaara raakumaari, *Gaandhaari*. Shivudi bhakthuraalu, entho andhamainadi."),
  LN("boon", "శివుడి వరంతో, ఆమెకు వంద మంది కొడుకులు పుడతారని తెలిసింది.", "Shivudi varamtho, aameku *vanda* mandi kodukulu pudathaarani thelisindi."),
  LN("prop", "అది విని, భీష్ముడు హస్తినాపురం నుంచి, పెళ్లి సంబంధం పంపాడు.", "Adi vini, *Bheeshmudu* Hasthinaapuram nunchi, pelli sambandham pampaadu."),
  LN("blind", "కానీ వరుడు... పుట్టుకతోనే కళ్ళు లేని, ధృతరాష్ట్రుడు!", "Kaani varudu... puttukathone kallu leni, *Dhrutharaashtrudu*!"),
  LN("quiet", "ఆ మాట విన్న గాంధారి, ఒక్క క్షణం మౌనంగా ఉండిపోయింది.", "Aa maata vinna Gaandhaari, okka kshanam *mounamgaa* undipoyindi."),
  LN("cloth", "తర్వాత, ఒక వస్త్రాన్ని ఎన్నో మడతలు పెట్టి... తన కళ్ళకు కట్టేసుకుంది!", "Tharvaatha, oka vasthraanni enno madathalu petti... thana kallaku *kattesukundi*!"),
  LN("why", "భర్తకు లేని చూపు, నాకు కూడా వద్దు. అతన్ని మించి ఉండకూడదు, అనుకుంది.", "Bharthaku leni choopu, naaku kuda *vaddu*. Athanni minchi undakoodadu, anukundi."),
  LN("years", "అలా ఎన్నో సంవత్సరాలు... తన పిల్లల ముఖాలు కూడా చూడలేదు.", "Alaa enno samvathsaraalu... thana pillala *mukhaalu* kuda choodaledu."),
  LN("war", "యుద్ధంలో, ఆమె వంద మంది కొడుకులూ చనిపోయారు.", "Yuddhamlo, aame vanda mandi kodukuloo *chanipoyaaru*."),
  LN("toe", "కోపంతో, గంతల కింద నుంచి ధర్మరాజు కాలి వేళ్ళను చూసింది. అతని గోళ్ళు నల్లగా మాడిపోయాయి!", "Kopamtho, ganthala kinda nunchi Dharmaraaju kaali vellanu choosindi. Athani *gollu* nallagaa maadipoyaayi!"),
  LN("curse", "కృష్ణుడినే శపించింది. ముప్పై ఆరు ఏళ్ళలో, నీ వంశం కూడా ఇలాగే నాశనం అవుతుంది!", "Krishnudine *shapinchindi*. Muppai aaru yellalo, nee vamsham kuda ilaage naasanam avuthundi!"),
  LN("end", "భర్త కోసం చూపునే వదిలేసింది... అదే గాంధారి త్యాగం.", "Bhartha kosam choopune vadilesindi... ade Gaandhaari *thyaagam*."),
  LN("cta", "ఇంకా ఇలాంటి కథల కోసం... ఫాలో అవ్వండి!", "Inka ilaanti kathala kosam... *follow* avvandi!"),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

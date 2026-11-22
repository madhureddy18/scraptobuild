// Narasimha Part 1/3 — Hiranyakashipu's boon (Telugu daily reel, batch 22 Nov 2026). Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Bhagavata Purana, Canto 7 ch. 2-4 (Hiranyaksha killed by Varaha; Hiranyakashipu's tapas on Mandara, anthill and ants eating his flesh, the heat scorching the worlds; Brahma revives him with kamandalu water; boon: not by man or animal, not inside or outside, not by day or night, not on ground or in sky, not by any weapon; conquers the three worlds, takes Indra's seat). Series Narasimha 1/3.
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.22, ...o });
window.STB_LINES = [
  LN("hook", "దేవుడు కూడా తనను చంపలేనంత వరం సంపాదించిన రాక్షసుడు ఎవరో తెలుసా?", "Devudu kuda thananu champalenantha *varam* sampaadinchina raakshasudu evaro thelusaa?"),
  LN("who", "హిరణ్యకశిపుడు! అతని తమ్ముడు హిరణ్యాక్షుడిని, విష్ణువు వరాహ అవతారంలో చంపాడు.", "*Hiranyakashipudu*! Athani thammudu Hiranyaakshudini, Vishnuvu Varaaha avathaaramlo champaadu."),
  LN("vow", "ప్రతీకారం తీర్చుకుంటా! అని, అతను మందర పర్వతం మీద ఘోర తపస్సు మొదలుపెట్టాడు.", "*Pratheekaaram* theerchukuntaa! Ani, athanu Mandara parvatham meeda ghora thapassu modalupettaadu."),
  LN("tapas", "ఒంటి కాలి మీద నిలబడి, సంవత్సరాల తరబడి... కదలకుండా!", "Onti kaali meeda nilabadi, samvathsaraala tharabadi... *kadalakundaa*!"),
  LN("anthill", "అతని శరీరం మీద పుట్ట కట్టింది. చీమలు అతని మాంసాన్ని తినేశాయి!", "Athani shareeram meeda *putta* kattindi. Cheemalu athani maamsaanni thinesaayi!"),
  LN("heat", "అతని తపస్సు వేడికి, లోకాలన్నీ కాలిపోతున్నాయి. దేవతలు భయపడ్డారు.", "Athani thapassu *vediki*, lokaalanni kaalipothunnaayi. Devathalu bhayapaddaaru."),
  LN("brahma", "చివరికి బ్రహ్మ దేవుడు వచ్చాడు. కమండలం నీళ్ళు చల్లగానే, అతని శరీరం మళ్ళీ బంగారంలా మెరిసింది!", "Chivariki *Brahma* devudu vachaadu. Kamandalam neellu challagaane, athani shareeram malli bangaaramlaa merisindi!"),
  LN("ask", "హిరణ్యకశిపుడు తెలివిగా అడిగాడు...", "Hiranyakashipudu *thelivigaa* adigaadu..."),
  LN("b1", "మనిషి వల్ల కానీ, జంతువు వల్ల కానీ, నాకు మరణం రాకూడదు!", "Manishi valla kaani, *janthuvu* valla kaani, naaku maranam raakoodadu!"),
  LN("b2", "ఇంట్లో కానీ, బయట కానీ. పగలు కానీ, రాత్రి కానీ!", "Intlo kaani, bayata kaani. *Pagalu* kaani, raathri kaani!"),
  LN("b3", "భూమి మీద కానీ, ఆకాశంలో కానీ. ఏ ఆయుధంతో కానీ, చావు రాకూడదు!", "Bhoomi meeda kaani, aakaasamlo kaani. Ye *aayudhamtho* kaani, chaavu raakoodadu!"),
  LN("granted", "బ్రహ్మ తథాస్తు అన్నాడు. ఆ క్షణం నుంచి, ముల్లోకాలూ అతని పాదాల కింద!", "Brahma *thathaasthu* annaadu. Aa kshanam nunchi, mullokaaloo athani paadaala kinda!"),
  LN("throne", "ఇంద్రుడి సింహాసనం లాక్కున్నాడు. నేనే దేవుడిని! అని ప్రకటించాడు.", "Indrudi simhaasanam laakkunnaadu. *Nene* devudini! Ani prakatinchaadu."),
  LN("twist", "కానీ, అతని ఇంట్లోనే... ఒక చిన్న పిల్లవాడు, విష్ణువు పేరు జపిస్తున్నాడు!", "Kaani, athani intlone... oka chinna pillavaadu, *Vishnuvu* peru japisthunnaadu!"),
  LN("cta", "మిగతా కథ రేపు Part 2 లో... ఫాలో అవ్వండి!", "Migathaa katha repu *Part 2* lo... follow avvandi!"),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

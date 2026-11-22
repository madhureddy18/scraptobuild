// Shakuni's dice — the folk revenge story (Telugu daily reel, batch 22 Nov 2026). Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: In Vyasa's Mahabharata (Sabha Parva) Shakuni is Gandhari's brother and Duryodhana's ally who wins the dice game. The prison / one-handful-of-rice / dice-from-his-father's-bones revenge story is LATER FOLKLORE (popular retellings; the bone-dice appears in Sarala Dasa's Odia Mahabharata) — said as 'jaanapada kathallo' / 'konni kathala prakaaram'.
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.5, ...o });
window.STB_LINES = [
  LN("hook", "శకుని, సొంత మేనల్లుళ్ళ వంశాన్నే నాశనం చేశాడు. ఎందుకు?", "Shakuni, sontha menallulla *vamshaanne* naasanam chesaadu. Enduku?"),
  LN("truth", "ముందు ఒక నిజం. వ్యాస మహాభారతంలో, శకుని దుర్యోధనుడి మేనమామ, అతని ఆప్తుడు మాత్రమే.", "Mundu oka *nijam*. Vyaasa Mahaabhaarathamlo, Shakuni Duryodhanudi menamaama, athani aapthudu maathrame."),
  LN("folk", "కానీ తర్వాతి కాలం జానపద కథల్లో, ఒక చీకటి ప్రతీకారం కథ ఉంది.", "Kaani tharvaathi kaalam *jaanapada* kathallo, oka cheekati pratheekaaram katha undi."),
  LN("goat", "ఆ కథ ప్రకారం, గాంధారి జాతకంలో దోషం ఉందని, ముందు ఒక మేకతో పెళ్లి చేశారు.", "Aa katha prakaaram, Gaandhaari jaathakamlo *dosham* undani, mundu oka mekatho pelli chesaaru."),
  LN("prison", "గాంధార రాజు సుబలుడిని, అతని కొడుకులందరినీ, చీకటి చెరసాలలో వేశారు.", "Gaandhaara raaju Subaludini, athani kodukulandarinee, cheekati *cherasaalalo* vesaaru."),
  LN("rice", "రోజుకు, అందరికీ కలిపి... ఒక్క గుప్పెడు అన్నం మాత్రమే!", "Rojuku, andarikee kalipi... okka *guppedu* annam maathrame!"),
  LN("choose", "అందరూ బతకలేరు. అందుకే, అందరిలో తెలివైన శకునికే, ఆ అన్నం పెట్టారు.", "Andaroo brathakaleru. Anduke, andarilo thelivaina *Shakunike*, aa annam pettaaru."),
  LN("die", "ఒక్కొక్కరుగా, అన్నలందరూ, అతని కళ్ళ ముందే చనిపోయారు.", "Okkokkarugaa, annalandaroo, athani kalla mundhe *chanipoyaaru*."),
  LN("leg", "తండ్రి, శకుని కాలు విరగ్గొట్టాడు. ఈ కుంటితనం, మన అవమానాన్ని నీకు రోజూ గుర్తు చేయాలి!", "Thandri, Shakuni kaalu viraggottaadu. Ee *kuntithanam*, mana avamaanaanni neeku roju gurthu cheyaali!"),
  LN("bones", "నేను చనిపోయాక, నా ఎముకలతో పాచికలు చేసుకో. అవి నువ్వు చెప్పినట్టే పడతాయి!", "Nenu chanipoyaaka, naa *emukalatho* paachikalu chesuko. Avi nuvvu cheppinatte padathaayi!"),
  LN("game", "ఆ పాచికలతోనే, జూదంలో పాండవుల రాజ్యం గెలిచాడు. ఆ ఆటే, కురుక్షేత్రానికి దారి తీసింది.", "Aa paachikalathone, joodamlo Paandavula raajyam gelichaadu. Aa aate, *Kurukshethraaniki* daari theesindi."),
  LN("end", "కౌరవులకు దగ్గరగా ఉంటూనే, వాళ్ళ వినాశనానికి కారణమయ్యాడు శకుని.", "Kauravulaku daggaragaa untoone, vaalla *vinaashanaaniki* kaaranamayyaadu Shakuni."),
  LN("cta", "ఇంకా ఇలాంటి కథల కోసం... ఫాలో అవ్వండి!", "Inka ilaanti kathala kosam... *follow* avvandi!"),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

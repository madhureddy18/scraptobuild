// Abhimanyu Part 2/3 — the 13th day, alone inside the Chakravyuha. Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Mahabharata, Drona Parva (Abhimanyu-vadha): Samsaptakas draw Arjuna away; Yudhishthira asks Abhimanyu to break in; Jayadratha (Shiva's boon) holds back the other Pandavas;
// Abhimanyu kills Duryodhana's son Lakshmana and many others; Drona praises him and tells Karna to cut his bow from behind; six maharathis then attack together.
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.3, ...o });
window.STB_LINES = [
  LN('recap', 'నిన్న చూశాం, అభిమన్యుడికి చక్రవ్యూహంలోకి వెళ్ళడం మాత్రమే తెలుసు. మరి పదమూడో రోజు ఏమైంది?', 'Ninna choosam, Abhimanyudiki Chakravyuhamloki velladam maatrame telusu. Mari *padamoodo roju* emaindi?', { gap: 0.35 }),
  LN('crush', 'ద్రోణుడి చక్రవ్యూహం, పాండవ సైన్యాన్ని నలిపేస్తోంది. అర్జునుడు దూరంగా, సంశప్తకులతో యుద్ధం చేస్తున్నాడు.', 'Dronudi Chakravyuham, Pandava sainyaanni nalipestondi. Arjunudu dooranga, *Samsaptakulatho* yuddham chesthunnadu.'),
  LN('ask', 'ధర్మరాజు అభిమన్యుడిని అడిగాడు. నువ్వు ద్వారం తెరువు, మేమంతా నీ వెనకే వస్తాం!', 'Dharmaraju Abhimanyudini adigadu. Nuvvu dwaaram *theruvu*, memantha nee venake vastham!'),
  LN('charge', 'పదహారేళ్ళ అభిమన్యుడు, ఒక్క క్షణం కూడా ఆలోచించలేదు. రథాన్ని వ్యూహం వైపు దూకించాడు!', 'Padahaarella Abhimanyudu, okka kshanam kooda aalochinchaledu. Rathaanni vyuham vaipu *dookinchadu*!'),
  LN('breach', 'మొదటి వరుస బద్దలైంది! అభిమన్యుడు లోపలికి దూసుకెళ్ళాడు.', 'Modati varusa *baddalaindi*! Abhimanyudu lopaliki doosukelladu.'),
  LN('block', 'కానీ వెనకే వస్తున్న పాండవులను, జయద్రథుడు అడ్డుకున్నాడు.', 'Kaani venake vasthunna Pandavulanu, *Jayadrathudu* addukunnadu.'),
  LN('boon', 'శివుడి వరం వల్ల, ఆ ఒక్క రోజు, అర్జునుడు తప్ప పాండవులందరినీ ఆపగలడు.', 'Shivudi varam valla, aa okka roju, Arjunudu thappa Pandavulandarini *aapagaladu*.'),
  LN('alone', 'ద్వారం మళ్ళీ మూసుకుపోయింది. లోపల, అభిమన్యుడు ఒంటరిగా!', 'Dwaaram malli moosukupoyindi. Lopala, Abhimanyudu *ontariga*!', { gap: 0.4 }),
  LN('fight', 'అయినా భయపడలేదు. దుర్యోధనుడి కొడుకు లక్ష్మణుడితో సహా, ఎందరో వీరులను కూల్చాడు!', 'Ayina bhayapadaledu. Duryodhanudi koduku *Lakshmanuditho* saha, endaro veerulanu koolchadu!'),
  LN('none', 'ద్రోణుడు, కర్ణుడు, కృపుడు, అశ్వత్థామ, ఎవరూ అతన్ని ఆపలేకపోయారు.', 'Dronudu, Karnudu, Krupudu, Ashwatthama, evaru athanni *aapalekapoyaru*.'),
  LN('praise', 'ద్రోణుడే మెచ్చుకున్నాడు. ఇతను అర్జునుడితో సమానం!', 'Dronude mechhukunnadu. Ithanu *Arjunuditho* samaanam!'),
  LN('trick', 'అప్పుడు ద్రోణుడు కర్ణుడికి చెప్పాడు. ఎదురుగా గెలవలేం, వెనక నుంచి అతని విల్లు విరగ్గొట్టు!', 'Appudu Dronudu Karnudiki cheppadu. Eduruga gelavalem, venaka nunchi athani *villu* viraggottu!', { gap: 0.4 }),
  LN('six', 'మహాభారతం ద్రోణ పర్వం ప్రకారం, ఆ తర్వాత ఆరుగురు మహారథులు, ఒక్కసారిగా అతని మీద పడ్డారు!', 'Mahabharatam Drona parvam prakaaram, aa tarvaata *aaruguru* maharathulu, okkasaariga athani meeda paddaru!', { gap: 0.4 }),
  LN('cta', 'ఒంటరి అభిమన్యుడు ఏం చేశాడు? మిగతా కథ రేపు, పార్ట్ త్రీ లో. ఫాలో అవ్వండి!', 'Ontari Abhimanyudu em chesadu? Migatha katha repu, *Part 3* lo. Follow avvandi!', { gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

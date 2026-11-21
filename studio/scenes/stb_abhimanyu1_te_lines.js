// Abhimanyu Part 1/3 — how he learned the Chakravyuha in the womb (Telugu daily reel, 2D puppet animation). Narrator = Maddy's cloned voice (maddy2_te2).
// omni = Telugu script for the voice model; text = Tinglish subtitle of exactly what is spoken (*word* = yellow).
// Source: Mahabharata, Drona Parva (Abhimanyu-vadha) — Abhimanyu himself tells Yudhishthira he knows how to break into the Chakravyuha but not how to come out.
// The womb story (Arjuna telling Subhadra, Subhadra falling asleep / Krishna stopping it) is a popular later retelling — said as "konni kathala prakaaram".
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.3, ...o });
window.STB_LINES = [
  LN('hook', 'పుట్టకముందే... తల్లి కడుపులోనే, యుద్ధ విద్య నేర్చుకున్న వీరుడు ఎవరో తెలుసా?', 'Puttakamunde... thalli kadupulone, *yuddha vidya* nerchukunna veerudu evaro telusa?', { gap: 0.35 }),
  LN('who', 'అర్జునుడు, సుభద్రల కొడుకు... అభిమన్యుడు!', 'Arjunudu, Subhadrala koduku... *Abhimanyudu*!'),
  LN('night', 'సుభద్ర గర్భవతిగా ఉన్నప్పుడు, ఒక రాత్రి అర్జునుడు ఆమెకు ఒక కథ చెప్పాడు.', 'Subhadra garbhavathiga unnappudu, oka *raatri* Arjunudu aameku oka katha cheppadu.'),
  LN('vyuha', 'అది మామూలు కథ కాదు... చక్రవ్యూహం! తిరిగే చక్రంలా, వరుసల మీద వరుసలు సైనికులు.', 'Adi maamoolu katha kaadu... *Chakravyuham*! Tirige chakramla, varusala meeda varusalu sainikulu.', { gap: 0.4 }),
  LN('danger', 'లోపలికి వెళ్ళిన వాడు... బయటికి రావడం చాలా కష్టం!', 'Lopaliki vellina vaadu... bayatiki raavadam chaala *kashtam*!', { gap: 0.4 }),
  LN('explain', 'మొదటి ద్వారం ఎలా ఛేదించాలి, రెండో ద్వారం ఎలా... అర్జునుడు ఒక్కొక్కటీ చెప్తున్నాడు.', 'Modati dwaaram ela chedhinchaali, rendo dwaaram ela... Arjunudu *okkokkati* chepthunnadu.'),
  LN('listen', 'కడుపులో ఉన్న బిడ్డ... ప్రతి మాటా వింటున్నాడు!', 'Kadupulo unna bidda... prathi maata *vintunnadu*!', { gap: 0.45 }),
  LN('sleep', 'కానీ బయటికి వచ్చే దారి చెప్పే ముందే... సుభద్రకు నిద్ర వచ్చేసింది.', 'Kaani bayatiki vacche daari cheppe munde... Subhadraku *nidra* vacchesindi.', { gap: 0.45 }),
  LN('krishna', 'కొన్ని కథల ప్రకారం, కృష్ణుడే వచ్చి... ఆ కథను మధ్యలో ఆపేశాడు.', 'Konni kathala prakaaram, *Krishnude* vacchi... aa kathanu madhyalo aapesadu.'),
  LN('half', 'అలా... లోపలికి వెళ్ళడం నేర్చుకున్నాడు. బయటికి రావడం మాత్రం... నేర్చుకోలేదు!', 'Alaa... lopaliki velladam nerchukunnadu. Bayatiki raavadam maatram... *nerchukoledu*!', { gap: 0.45 }),
  LN('grow', 'అభిమన్యుడు ద్వారకలో పెరిగాడు. పదహారేళ్ళకే... గొప్ప విలుకాడు అయ్యాడు.', 'Abhimanyudu Dwaarakalo perigadu. Padahaarellake... goppa *vilukaadu* ayyadu.'),
  LN('day13', 'కురుక్షేత్రంలో పదమూడో రోజు... ద్రోణుడు చక్రవ్యూహం పన్నాడు! అర్జునుడు దూరంగా ఉన్నాడు.', 'Kurukshetramlo *padamoodo roju*... Dronudu Chakravyuham pannadu! Arjunudu dooranga unnadu.', { gap: 0.4 }),
  LN('source', 'మహాభారతం ద్రోణ పర్వంలో, అభిమన్యుడే చెప్తాడు... లోపలికి వెళ్ళడం తెలుసు, బయటికి రావడం తెలియదు!', 'Mahabharatam *Drona parvamlo*, Abhimanyude cheptaadu... lopaliki velladam telusu, bayatiki raavadam teliyadu!', { gap: 0.4 }),
  LN('cta', 'మరి ఆ వ్యూహంలో ఏమైంది? మిగతా కథ రేపు Part 2 లో... ఫాలో అవ్వండి!', 'Mari aa vyuhamlo emaindi? Migatha katha repu *Part 2* lo... follow avvandi!', { gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

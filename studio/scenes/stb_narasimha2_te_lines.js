// Narasimha Part 2/3 — Prahlada can't be killed (Telugu daily reel, batch 22 Nov 2026). Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Bhagavata Purana, Canto 7 ch. 5 & 7 (Indra seizes Kayadhu, Narada protects her in his ashram where the unborn Prahlada hears Narada's teaching; Prahlada's answer on his father's lap; the attempts to kill him: weapons, elephants, serpents, cliff, poison, fire, all fail). Series Narasimha 2/3.
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.45, ...o });
window.STB_LINES = [
  LN("recap", "నిన్న చూశాం... హిరణ్యకశిపుడికి, దాదాపు చావే లేని వరం వచ్చింది.", "Ninna choosaam... Hiranyakashipudiki, daadaapu *chaave* leni varam vachindi."),
  LN("kayadhu", "అతను తపస్సులో ఉన్నప్పుడు, ఇంద్రుడు అతని భార్య కయాధును ఎత్తుకెళ్ళాడు.", "Athanu thapassulo unnappudu, Indrudu athani bhaarya *Kayaadhunu* etthukellaadu."),
  LN("narada", "నారదుడు ఆమెను కాపాడి, తన ఆశ్రమంలో ఉంచాడు. అప్పుడు ఆమె గర్భవతి.", "*Naaradudu* aamenu kaapaadi, thana aashramamlo unchaadu. Appudu aame garbhavathi."),
  LN("womb", "నారదుడు చెప్పిన విష్ణు కథలన్నీ, కడుపులో ఉన్న బిడ్డ విన్నాడు. ఆ బిడ్డే, ప్రహ్లాదుడు!", "Naaradudu cheppina Vishnu kathalanni, kadupulo unna bidda vinnaadu. Aa bidde, *Prahlaadudu*!"),
  LN("school", "గురుకులంలో గురువులు ఏం చెప్పినా, ప్రహ్లాదుడు ఒక్కటే మాట అనేవాడు. నారాయణ!", "Gurukulamlo guruvulu em cheppinaa, Prahlaadudu okkate maata anevaadu. *Naaraayana*!"),
  LN("lap", "తండ్రి ఒడిలో కూర్చోబెట్టుకుని అడిగాడు. నాయనా, నువ్వు నేర్చుకున్న మంచి విషయం ఏంటి?", "Thandri odilo koorchobettukuni adigaadu. Naayanaa, nuvvu nerchukunna *manchi* vishayam enti?"),
  LN("answer", "విష్ణువును నమ్మడమే, అన్నిటికంటే గొప్ప విద్య, నాన్నా!", "*Vishnuvunu* nammadame, annitikante goppa vidya, naannaa!"),
  LN("rage", "తన శత్రువు పేరు, తన కొడుకు నోట్లో! హిరణ్యకశిపుడు అరిచాడు. వీణ్ణి చంపేయండి!", "Thana shathruvu peru, thana koduku notlo! Hiranyakashipudu arichaadu. Veenni *champeyandi*!"),
  LN("spears", "రాక్షసులు శూలాలతో పొడిచారు. ఒక్క గాయం కూడా కాలేదు!", "Raakshasulu shoolaalatho podichaaru. Okka *gaayam* kuda kaaledu!"),
  LN("eleph", "పెద్ద ఏనుగులతో తొక్కించారు. విషపు పాములతో కరిపించారు.", "Pedda *enugulatho* thokkinchaaru. Vishapu paamulatho karipinchaaru."),
  LN("cliff", "ఎత్తైన కొండ మీద నుంచి తోసేశారు. విషం ఇచ్చారు. అగ్నిలో పడేశారు!", "Etthaina konda meeda nunchi thosesaaru. *Visham* ichaaru. Agnilo padesaaru!"),
  LN("safe", "ప్రతిసారీ, ప్రహ్లాదుడు నవ్వుతూ... నారాయణ నామం జపిస్తూనే ఉన్నాడు.", "Prathisaaree, Prahlaadudu *navvuthoo*... Naaraayana naamam japisthoone unnaadu."),
  LN("fear", "మొదటిసారి, హిరణ్యకశిపుడికి భయం వేసింది. వీడి బలం ఎక్కడ నుంచి వస్తోంది?", "Modatisaari, Hiranyakashipudiki *bhayam* vesindi. Veedi balam ekkada nunchi vasthondi?"),
  LN("cta", "మిగతా కథ, రేపు Part 3 లో! ఫాలో అవ్వండి.", "Migathaa katha, repu *Part 3* lo! Follow avvandi."),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

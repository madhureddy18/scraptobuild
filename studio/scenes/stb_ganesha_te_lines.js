// Why does Ganesha have an elephant head? Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Shiva Purana, Rudra Samhita, Kumara Khanda (Parvati makes him from the paste on her body, the door, Shiva beheads him, Parvati's anger, the northward search, elephant head, Ganapati, first worship).
// Brahma Vaivarta Purana has another version (Shani's gaze) — said in the script.
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.3, ...o });
window.STB_LINES = [
  LN('hook', 'వినాయకుడికి ఏనుగు తల ఎందుకు ఉంది? అసలు ఆయన మొదటి తల ఏమైంది?', 'Vinaayakudiki *enugu thala* enduku undi? Asalu aayana modati thala emaindi?', { gap: 0.35 }),
  LN('bath', 'శివ పురాణం ప్రకారం, ఒకరోజు పార్వతీదేవి స్నానానికి వెళ్తూ, ఒక ఆలోచన చేసింది.', '*Shiva Puranam* prakaaram, okaroju Parvathi devi snaanaaniki velthu, oka aalochana chesindi.'),
  LN('make', 'తన ఒంటికి రాసుకున్న నలుగు పిండితో, ఒక బాలుడిని తయారు చేసి, ప్రాణం పోసింది!', 'Thana ontiki raasukunna *nalugu pinditho*, oka baaludini tayaaru chesi, praanam posindi!'),
  LN('guard', 'నువ్వు నా కొడుకువి. ఎవరినీ లోపలికి రానివ్వకు! అని ద్వారం దగ్గర కాపలా పెట్టింది.', 'Nuvvu naa kodukuvi. Evarini lopaliki *raanivvaku*! ani dwaaram daggara kaapala pettindi.'),
  LN('shiva', 'అప్పుడే కైలాసం నుంచి, శివుడు వచ్చాడు.', 'Appude *Kailaasam* nunchi, Shivudu vacchadu.'),
  LN('stop', 'ఆ బాలుడు శివుడిని కూడా ఆపేశాడు! నువ్వు ఎవరైనా సరే, లోపలికి వెళ్ళకూడదు!', 'Aa baaludu Shivudini kooda *aapesadu*! Nuvvu evaraina sare, lopaliki vellakoodadu!', { gap: 0.4 }),
  LN('battle', 'శివగణాలు వచ్చాయి, దేవతలు వచ్చారు. ఆ బాలుడు అందరినీ ఓడించాడు!', 'Shivaganaalu vacchayi, devathalu vaccharu. Aa baaludu andarini *odinchadu*!'),
  LN('behead', 'చివరికి కోపంతో, శివుడు త్రిశూలంతో, ఆ బాలుడి తల నరికేశాడు.', 'Chivariki kopamtho, Shivudu *trishoolamtho*, aa baaludi thala narikesadu.', { gap: 0.45 }),
  LN('parvati', 'పార్వతి వచ్చి చూసింది. ఆమె దుఃఖం, కోపంగా మారింది! లోకాలన్నీ నాశనం చేస్తాను!', 'Parvathi vacchi choosindi. Aame dukham, *kopanga* maarindi! Lokaalanni naasanam chesthaanu!', { gap: 0.4 }),
  LN('north', 'శివుడు గణాలకు చెప్పాడు. ఉత్తరం వైపు వెళ్ళండి. మొదట కనిపించిన ప్రాణి తల తీసుకురండి!', 'Shivudu ganaalaku cheppadu. *Uttharam* vaipu vellandi. Modata kanipinchina praani thala theesukurandi!'),
  LN('elephant', 'వాళ్ళకు మొదట కనిపించింది, ఒక ఏనుగు.', 'Vaallaku modata kanipinchindi, oka *enugu*.', { gap: 0.4 }),
  LN('revive', 'ఆ ఏనుగు తలను బాలుడికి పెట్టి, శివుడు మళ్ళీ ప్రాణం పోశాడు!', 'Aa enugu thalanu baaludiki petti, Shivudu malli *praanam* poshadu!'),
  LN('ganapati', 'గణాలకు అధిపతిగా చేశాడు, గణపతి! ఏ పూజ అయినా, మొదట ఆయనకే, అని వరం ఇచ్చాడు.', 'Ganaalaku adhipathiga chesadu, *Ganapathi*! E pooja ayina, modata aayanake, ani varam icchadu.'),
  LN('other', 'బ్రహ్మ వైవర్త పురాణంలో, శని చూపు వల్ల తల పోయిందని, ఇంకో కథ కూడా ఉంది.', 'Brahma Vaivarta Puranamlo, *Shani* choopu valla thala poyindani, inko katha kooda undi.'),
  LN('cta', 'ఇంకా ఇలాంటి కథల కోసం... ఫాలో అవ్వండి!', 'Inka ilaanti kathala kosam... *follow* avvandi!', { gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

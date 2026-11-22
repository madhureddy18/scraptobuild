// Ashwatthama: the curse that keeps him alive. Narrator = Maddy's cloned voice (maddy2_te2). text = Tinglish subtitle (*word* = yellow).
// Source: Mahabharata, Sauptika Parva — Drona's son, born with a gem on his forehead; after Duryodhana falls he sees an owl attack sleeping crows and plans a night attack;
// kills the sleeping Upapandavas and Dhrishtadyumna; uses the Brahmashira; turns it toward the Pandava wombs (Uttara); Krishna curses him to wander for 3000 years, alone and diseased;
// the gem is taken and given to Draupadi. "He still roams the earth" (chiranjeevi) is belief / later tradition — said as "nammakam".
const LN = (id, omni, text, o = {}) => ({ who: 'narrator', id, text, say: omni, omni, gap: 0.3, ...o });
window.STB_LINES = [
  LN('hook', 'ఐదు వేల సంవత్సరాలుగా, ఇంకా బతికే ఉన్నాడని నమ్మే ఒక వీరుడు ఉన్నాడు. ఎవరతను?', 'Aidu vela samvathsaraaluga, inka bathike unnadani namme oka *veerudu* unnadu. Evarathanu?', { gap: 0.35 }),
  LN('who', 'ద్రోణాచార్యుడి కొడుకు, అశ్వత్థామ. పుట్టినప్పుడే, నుదుటి మీద ఒక మణితో పుట్టాడు!', 'Dronaachaaryudi koduku, *Ashwatthaama*. Puttinappude, nuduti meeda oka manitho puttadu!'),
  LN('gem', 'ఆ మణి ఉన్నంత వరకు, ఆకలి, దప్పిక, భయం, ఏవీ అతన్ని తాకవు.', 'Aa *mani* unnantha varaku, aakali, dappika, bhayam, evi athanni thaakavu.'),
  LN('rage', 'కురుక్షేత్రంలో తండ్రి మోసంతో చనిపోయాడు. దుర్యోధనుడు పడిపోయాడు. అశ్వత్థామ రగిలిపోయాడు.', 'Kurukshetramlo thandri mosamtho chanipoyadu. Duryodhanudu padipoyadu. Ashwatthaama *ragilipoyadu*.'),
  LN('owl', 'ఆ రాత్రి, ఒక గుడ్లగూబ, నిద్రపోతున్న కాకుల మీద దాడి చేయడం చూశాడు.', 'Aa raathri, oka *gudlagooba*, nidrapothunna kaakula meeda daadi cheyadam choosadu.'),
  LN('raid', 'అదే చేశాడు. చీకట్లో పాండవ శిబిరంలోకి చొరబడి, నిద్రపోతున్న ద్రౌపది కొడుకులను చంపేశాడు.', 'Ade chesadu. Cheekatlo Paandava shibiramloki chorabadi, nidrapothunna Draupadi *kodukulanu* champesadu.', { gap: 0.4 }),
  LN('chase', 'పాండవులు అతన్ని వెంటాడారు. అశ్వత్థామ బ్రహ్మశిర అస్త్రం వేశాడు!', 'Paandavulu athanni ventaadaaru. Ashwatthaama *Brahmashira* asthram veshadu!'),
  LN('clash', 'అర్జునుడు కూడా అదే అస్త్రం వేశాడు. లోకం తగలబడిపోయేలా ఉంది!', 'Arjunudu kooda ade asthram veshadu. Lokam *thagalabadipoyela* undi!', { gap: 0.4 }),
  LN('recall', 'వ్యాసుడు ఆపమన్నాడు. అర్జునుడు తన అస్త్రాన్ని వెనక్కి తీసుకున్నాడు. అశ్వత్థామకు అది తెలియదు.', '*Vyaasudu* aapamannadu. Arjunudu thana asthraanni venakki theesukunnadu. Ashwatthaamaku adi teliyadu.'),
  LN('womb', 'అందుకే దాన్ని, ఉత్తర గర్భం వైపు మళ్ళించాడు.', 'Anduke daanni, *Utthara* garbham vaipu mallinchadu.', { gap: 0.4 }),
  LN('curse', 'కృష్ణుడు శపించాడు. మూడు వేల సంవత్సరాలు, ఒంటరిగా, గాయాలతో, ఈ భూమి మీద తిరుగుతావు!', 'Krishnudu shapinchadu. *Moodu vela* samvathsaraalu, ontariga, gaayaalatho, ee bhoomi meeda thiruguthaavu!', { gap: 0.45 }),
  LN('gemloss', 'అతని నుదుటి మణిని తీసి, ద్రౌపదికి ఇచ్చారు. మిగిలింది, ఒక మానని గాయం.', 'Athani nuduti manini theesi, Draupadiki icchaaru. Migilindi, oka *maanani gaayam*.'),
  LN('belief', 'మహాభారతం సౌప్తిక పర్వంలో ఉన్న కథ ఇది. అతను ఇంకా బతికే ఉన్నాడు అనేది, ఒక నమ్మకం.', 'Mahabharatam *Sauptika parvamlo* unna katha idi. Athanu inka bathike unnadu anedi, oka nammakam.'),
  LN('cta', 'ఇంకా ఇలాంటి కథల కోసం... ఫాలో అవ్వండి!', 'Inka ilaanti kathala kosam... *follow* avvandi!', { gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

// Dronagiri: myth-scale reel #1. narrator_v3 (cloned from Maddy's Nov 2026 clip), speed 0.95.
// Names use tested respellings in `omni`: Hanu-maan, Raamaayan, Vaalmeeki, Lakshman, Drona giri, Chamolee, Utta-raa-khand, Burj Kha-lee-fa.
const LN = (who, text, say, o = {}) => { const sy = say || text.replace(/\*/g, ''); return { who, text, say: sy.replace(/\[[a-z-]+\]\s*/g, ''), omni: o.omni || sy, ...o }; };
window.STB_LINES = [
  LN('narrator', 'This mountain is taller than *8 Burj Khalifas*.', 'This mountain is taller than eight Burj Khalifas.', { omni: 'This mountain is taller than eight Burj Kha-lee-fas.', id: 'hook1', gap: 0.35 }),
  LN('narrator', 'Legend says *Hanuman* flew with it all the way to *Lanka*.', null, { omni: 'Legend says, Hanu-maan flew with it, all the way to Lanka.', id: 'hook2', gap: 0.3 }),
  LN('narrator', 'In *Valmiki\'s Ramayana*, *Lakshmana* is struck down in the war at Lanka.', 'In Valmiki\'s Ramayana, Lakshmana is struck down in the war at Lanka.', { omni: 'In Vaalmeeki\'s Raamaayan, Lakshman is struck down, in the war at Lanka.', id: 'src', gap: 0.3 }),
  LN('narrator', 'The cure? *Herbs* from a mountain in the *Himalayas*.', 'The cure? Herbs, from a mountain in the Himalayas.', { id: 'herb', gap: 0.3 }),
  LN('narrator', 'Tradition says that mountain is *Dronagiri*, in *Chamoli* district, *Uttarakhand*.', 'Tradition says that mountain is Dronagiri, in Chamoli district, Uttarakhand.', { omni: 'Tradition says that mountain is Drona giri, in Chamolee district, Uttaraakhand.', id: 'loc', gap: 0.3 }),
  LN('narrator', 'Today it stands *7,066 metres* tall.', 'Today it stands seven thousand and sixty-six metres tall.', { id: 'height', gap: 0.3 }),
  LN('narrator', 'Hanuman can\'t tell which herb is which. So he lifts the *whole peak*.', null, { omni: 'Hanu-maan can\'t tell which herb is which. So he lifts, the whole peak.', id: 'lift', gap: 0.3 }),
  LN('narrator', 'The epic says he grew *as big as a mountain*.', null, { id: 'giant', gap: 0.3 }),
  LN('narrator', 'Even just the *top 1 km* would weigh about *2.8 billion tonnes*.', 'Even just the top one kilometre would weigh about two point eight billion tonnes.', { id: 'weight', gap: 0.35 }),
  LN('narrator', 'That\'s heavier than *every human on Earth*. *Five times* over.', null, { id: 'humans', gap: 0.3 }),
  LN('narrator', 'And I get tired carrying *two grocery bags* up the stairs.', null, { omni: '[sigh] And I get tired, carrying two grocery bags up the stairs.', id: 'me', gap: 0.3 }),
  LN('narrator', 'Then he flies it about *2,300 km* to *Lanka*.', 'Then he flies it about two thousand three hundred kilometres to Lanka.', { id: 'dist', gap: 0.35 }),
  LN('narrator', 'Most retellings say: *before sunrise*.', null, { id: 'dawn', gap: 0.35 }),
  LN('narrator', 'Give him ten hours. That\'s *230 km/h*. Faster than any train in India.', 'Give him ten hours. That\'s two hundred and thirty kilometres an hour. Faster than any train in India.', { id: 'speed', gap: 0.3 }),
  LN('narrator', 'Meanwhile, my food delivery takes *40 minutes* from *2 km* away.', 'Meanwhile, my food delivery takes forty minutes, from two kilometres away.', { omni: '[dissatisfaction-hnn] Meanwhile, my food delivery takes forty minutes, from two kilometres away.', id: 'food', gap: 0.3 }),
  LN('narrator', 'And in *Dronagiri village*, many still *don\'t worship Hanuman*.', null, { omni: 'And in Drona giri village, many still don\'t worship Hanu-maan.', id: 'twist', gap: 0.35 }),
  LN('narrator', 'They believe he took away their *sacred mountain*.', null, { id: 'why', gap: 0.3 }),
  LN('narrator', '*Follow* for more legends, at *real scale*.', null, { id: 'cta', gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 0.95 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

// Dronagiri v2: Zack D. Films style (one shot per line, story narration, no jokes). narrator_v4 (cloned from Maddy's narrator_1 clip), speed 1.0.
const LN = (who, text, say, o = {}) => { const sy = say || text.replace(/\*/g, ''); return { who, text, say: sy.replace(/\[[a-z-]+\]\s*/g, ''), omni: o.omni || sy, ...o }; };
window.STB_LINES = [
  LN('narrator', 'Legend says *Hanuman* once tore the top off this mountain... and flew it across *India*.', 'Legend says Hanuman once tore the top off this mountain, and flew it across India.', { omni: 'Legend says, Hanu-maan once tore the top off this mountain... and flew it across India.', id: 'hook', gap: 0.3 }),
  LN('narrator', 'This is *Dronagiri*, in *Uttarakhand*. It stands over *7,000 metres* tall.', 'This is Dronagiri, in Uttarakhand. It stands over seven thousand metres tall.', { omni: 'This is Drona giri, in Uttaraakhand. It stands over seven thousand metres tall.', id: 'loc', gap: 0.25 }),
  LN('narrator', 'In the *Ramayana*, *Lakshmana* is badly wounded in the war at *Lanka*.', null, { omni: 'In the Raamaayan, Lakshman is badly wounded, in the war at Lanka.', id: 'war', gap: 0.25 }),
  LN('narrator', 'Only herbs from a *Himalayan* mountain can save him. So Hanuman is sent to bring them.', null, { omni: 'Only herbs from a Himalayan mountain can save him. So Hanu-maan is sent to bring them.', id: 'sent', gap: 0.25 }),
  LN('narrator', 'But when he arrives, he can\'t tell which herb is which.', null, { id: 'herbs', gap: 0.25 }),
  LN('narrator', 'So he grows as big as a mountain, grabs the peak... and *tears it off*.', null, { id: 'tear', gap: 0.3 }),
  LN('narrator', 'Even just the top kilometre of a mountain like this would weigh around *2.8 billion tonnes*.', 'Even just the top kilometre of a mountain like this would weigh around two point eight billion tonnes.', { id: 'weight', gap: 0.25 }),
  LN('narrator', 'That\'s more than *five times* the weight of every human on Earth.', null, { id: 'humans', gap: 0.25 }),
  LN('narrator', 'Then he carries it about *2,300 kilometres* to Lanka, in a *single night*.', 'Then he carries it about two thousand three hundred kilometres to Lanka, in a single night.', { id: 'dist', gap: 0.25 }),
  LN('narrator', 'To do that in ten hours, he\'d have to fly at around *230 km/h*, with a mountain in his hand.', 'To do that in ten hours, he\'d have to fly at around two hundred and thirty kilometres an hour, with a mountain in his hand.', { id: 'speed', gap: 0.25 }),
  LN('narrator', 'The herbs work, and *Lakshmana wakes up*.', null, { omni: 'The herbs work, and Lakshman wakes up.', id: 'wake', gap: 0.3 }),
  LN('narrator', 'And to this day, many people in *Dronagiri village* don\'t worship Hanuman, because they believe he took their *sacred mountain*.', null, { omni: 'And to this day, many people in Drona giri village don\'t worship Hanu-maan, because they believe he took their sacred mountain.', id: 'village', gap: 0.3 }),
  LN('narrator', '*Follow* for more legends, at *real scale*.', null, { id: 'cta', gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

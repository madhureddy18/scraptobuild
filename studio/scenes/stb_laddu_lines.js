// The secret kitchen of Tirumala: how the Tirupati laddu is made. Epic Documentary narrator (0.86x + clarity EQ).
const LN = (who, text, say, o = {}) => { const sy = say || text.replace(/\*/g, ''); return { who, text, say: sy.replace(/\[[a-z-]+\]\s*/g, ''), omni: o.omni || sy, ...o }; };
window.STB_LINES = [
  LN('narrator', 'Inside Tirumala temple, there is a *secret kitchen*.', 'Inside Tirumala temple, there is a secret kitchen.', { id: 'hook1', gap: 0.35 }),
  LN('narrator', 'Every single day, it makes around *3 lakh laddus*.', 'Every single day, it makes around three lakh laddus.', { id: 'hook2', gap: 0.35 }),
  LN('narrator', 'By hand. Without stopping. *Watch how*.', null, { id: 'hook3', gap: 0.6 }),
  LN('narrator', 'This is *Tirumala*, in *Andhra Pradesh*. The temple sits on the *seventh* of *seven hills*.', 'This is Tirumala, in Andhra Pradesh. The temple sits on the seventh of seven hills.', { id: 'loc', gap: 0.45 }),
  LN('narrator', 'Inside is the *Laddu Potu*, the temple kitchen.', 'Inside is the Laddu Potu, the temple kitchen.', { id: 'potu', gap: 0.35 }),
  LN('narrator', 'About *620 cooks* work here.', 'About six hundred and twenty cooks work here.', { id: 'cooks', gap: 0.4 }),
  LN('narrator', 'They have made this laddu since *1715*. Over *300 years*.', 'They have made this laddu since seventeen fifteen. Over three hundred years.', { id: 'since', gap: 0.6 }),
  LN('narrator', 'First, the *ingredients*. Every single day.', null, { id: 'ingr', gap: 0.35 }),
  LN('narrator', '*10 tonnes* of gram flour. *10 tonnes* of sugar.', 'Ten tonnes of gram flour. Ten tonnes of sugar.', { id: 'flour', gap: 0.4 }),
  LN('narrator', '*700 kg* cashews. *540 kg* raisins. *150 kg* cardamom.', 'Seven hundred kilos of cashews. Five hundred and forty kilos of raisins. One hundred and fifty kilos of cardamom.', { id: 'nuts', gap: 0.6 }),
  LN('narrator', '*Step one*: batter drops into hot ghee, and becomes *boondi*.', 'Step one: batter drops into hot ghee, and becomes boondi.', { id: 'step1', gap: 0.45 }),
  LN('narrator', '*Step two*: the boondi is mixed with *sugar syrup*, cashews, raisins and cardamom.', 'Step two: the boondi is mixed with sugar syrup, cashews, raisins and cardamom.', { id: 'step2', gap: 0.45 }),
  LN('narrator', '*Step three*: every laddu is *rolled by hand*.', 'Step three: every laddu is rolled by hand.', { id: 'step3', gap: 0.45 }),
  LN('narrator', '*Conveyor belts* carry raw materials in, and laddus out.', null, { id: 'belts', gap: 0.5 }),
  LN('narrator', 'Since *2009*, the name *Tirupati laddu* is protected by a *GI tag*.', 'Since two thousand and nine, the name Tirupati laddu is protected by a G I tag.', { id: 'gi', gap: 0.5 }),
  LN('narrator', 'And on big festival days, this kitchen can make up to *8 lakh laddus* in one day.', 'And on big festival days, this kitchen can make up to eight lakh laddus in one day.', { id: 'peak', gap: 0.5 }),
  LN('narrator', '*Follow* for more secrets like this.', null, { id: 'cta', gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 0.86 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

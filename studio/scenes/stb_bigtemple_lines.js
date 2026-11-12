// Brihadeeswarar Temple, Thanjavur: myth-buster format. narrator_v2 (cloned from Maddy's clip, normal speed).
const LN = (who, text, say, o = {}) => { const sy = say || text.replace(/\*/g, ''); return { who, text, say: sy.replace(/\[[a-z-]+\]\s*/g, ''), omni: o.omni || sy, ...o }; };
window.STB_LINES = [
  LN('narrator', 'They say this temple\'s *shadow* never touches the ground.', 'They say this temple\'s shadow never touches the ground.', { id: 'hook1', gap: 0.4 }),
  LN('narrator', 'That\'s a *myth*. But the truth is even *crazier*.', null, { id: 'hook2', gap: 0.6 }),
  LN('narrator', 'This is the *Brihadeeswarar Temple*, in *Thanjavur*, *Tamil Nadu*.', 'This is the Brihadeeswarar Temple, in Thanjavur, Tamil Nadu.', { omni: 'This is the Brihadeeswarar Temple, in Thanjavoor, Tamil Nadu.', id: 'loc', gap: 0.4 }),
  LN('narrator', 'King *Rajaraja Chola* built it around *1010*. More than *1,000 years* ago.', 'King Rajaraja Chola built it around ten-ten. More than a thousand years ago.', { omni: 'King Raja Raja Chola built it around the year ten-ten. More than a thousand years ago.', id: 'built', gap: 0.5 }),
  LN('narrator', 'Its tower rises about *66 metres*. Like a *20-storey* building.', 'Its tower rises about sixty-six metres. Like a twenty-storey building.', { id: 'height', gap: 0.5 }),
  LN('narrator', 'It is made of around *1,30,000 tonnes* of *granite*.', 'It is made of around one hundred and thirty thousand tonnes of granite.', { id: 'granite', gap: 0.4 }),
  LN('narrator', 'But Thanjavur is *flat river land*. There are *no granite hills* nearby.', 'But Thanjavur is flat river land. There are no granite hills nearby.', { omni: 'But Thanjavoor is flat river land. There are no granite hills nearby.', id: 'flat', gap: 0.4 }),
  LN('narrator', 'Every block was hauled in from *far away*.', null, { id: 'haul', gap: 0.6 }),
  LN('narrator', 'And the *top stone*? It is said to weigh about *80 tonnes*.', 'And the top stone? It is said to weigh about eighty tonnes.', { id: 'top', gap: 0.4 }),
  LN('narrator', '*No cranes*. So how did it get *66 metres* up?', 'No cranes. So how did it get sixty-six metres up?', { id: 'lift', gap: 0.5 }),
  LN('narrator', 'Legend says they built a *ramp*, about *6 kilometres* long.', 'Legend says they built a ramp, about six kilometres long.', { id: 'ramp', gap: 0.35 }),
  LN('narrator', '*Elephants* and people dragged it up... *inch by inch*.', null, { id: 'drag', gap: 0.6 }),
  LN('narrator', 'Even the *Nandi* at the entrance is carved from *one single rock*.', null, { id: 'nandi', gap: 0.6 }),
  LN('narrator', 'And the shadow? It *does* fall on the ground.', null, { id: 'shadow1', gap: 0.3 }),
  LN('narrator', 'At *noon*, it simply hides under the temple\'s own *base*.', 'At noon, it simply hides under the temple\'s own base.', { id: 'shadow2', gap: 0.6 }),
  LN('narrator', '*1,000 years* later, it still stands. A *UNESCO World Heritage Site*.', 'A thousand years later, it still stands. A UNESCO World Heritage Site.', { id: 'today', gap: 0.4 }),
  LN('narrator', '*Follow* for the next build.', null, { id: 'cta', gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 1.0 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

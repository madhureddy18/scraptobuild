// Kailasa Temple (Cave 16, Ellora) - full reel, Epic Documentary narrator (slow + clarity EQ)
const LN = (who, text, say, o = {}) => { const sy = say || text.replace(/\*/g, ''); return { who, text, say: sy.replace(/\[[a-z-]+\]\s*/g, ''), omni: o.omni || sy, ...o }; };
window.STB_LINES = [
  LN('narrator', 'Nobody *built* this temple.', null, { id: 'hook1', gap: 0.3 }),
  LN('narrator', 'They *carved* it... out of *one single rock*.', 'They carved it... out of one single rock.', { id: 'hook2', gap: 0.4 }),
  LN('narrator', 'And they started from the *roof*. Not the floor.', null, { id: 'hook3', gap: 0.4 }),
  LN('narrator', 'One wrong hit could *ruin everything*. Watch how they did it.', null, { id: 'tease', gap: 0.6 }),
  LN('narrator', 'This is the *Kailasa Temple*, at the *Ellora Caves*, in *Maharashtra, India*.', 'This is the Kailasa Temple, at the Ellora Caves, in Maharashtra, India.', { id: 'loc', gap: 0.4 }),
  LN('narrator', 'Ellora has *34 caves*, cut into one long cliff. Kailasa is *Cave 16*.', 'Ellora has thirty-four caves, cut into one long cliff. Kailasa is cave sixteen.', { id: 'caves', gap: 0.45 }),
  LN('narrator', 'It was carved around the year *760*, under King *Krishna the First*.', 'It was carved around the year seven hundred and sixty, under King Krishna the First.', { id: 'when', gap: 0.6 }),
  LN('narrator', '*Step one*. Workers cut *three deep trenches* into the hill.', 'Step one. Workers cut three deep trenches into the hill.', { id: 'step1', gap: 0.35 }),
  LN('narrator', 'That left *one giant block* of rock, standing alone.', null, { id: 'block', gap: 0.5 }),
  LN('narrator', '*Step two*. They started at the *top*, and carved *downwards*.', 'Step two. They started at the top, and carved downwards.', { id: 'step2', gap: 0.35 }),
  LN('narrator', 'First the *roof*. Then the *walls*. Then the *floor*.', null, { id: 'order', gap: 0.45 }),
  LN('narrator', 'No machines. Only *hammers* and *chisels*.', null, { id: 'tools', gap: 0.45 }),
  LN('narrator', 'They removed about *200,000 tonnes* of stone.', 'They removed about two hundred thousand tonnes of stone.', { id: 'tonnes', gap: 0.55 }),
  LN('narrator', 'The temple is about *32 metres* tall. As high as a *ten-storey building*.', 'The temple is about thirty-two metres tall. As high as a ten-storey building.', { id: 'size', gap: 0.5 }),
  LN('narrator', 'Pillars, stairs, bridges, even *life-size elephants*. All *one piece* of rock.', null, { id: 'onepiece', gap: 0.55 }),
  LN('narrator', 'And there was *no undo*.', null, { id: 'undo1', gap: 0.3 }),
  LN('narrator', 'One wrong strike... and the stone could *never be put back*.', 'One wrong strike... and the stone could never be put back.', { id: 'undo2', gap: 0.6 }),
  LN('narrator', 'Today, it is a *UNESCO World Heritage Site*. Still standing, after *1,200 years*.', 'Today, it is a UNESCO World Heritage Site. Still standing, after twelve hundred years.', { id: 'today', gap: 0.5 }),
  LN('narrator', 'Comment *ROCK* if this amazed you. And *follow* for the next build.', null, { id: 'cta', gap: 0.2 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 0.86 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

// Kailasa Temple (Cave 16, Ellora) - 3-line demo cut, Epic Documentary narrator (0.9x + clarity EQ)
const LN = (who, text, say, o = {}) => { const sy = say || text.replace(/\*/g, ''); return { who, text, say: sy.replace(/\[[a-z-]+\]\s*/g, ''), omni: o.omni || sy, ...o }; };
window.STB_LINES = [
  LN('narrator', 'This temple was not *built*. It was *carved*... from *one single rock*.', 'This temple was not built. It was carved... from one single rock.', { id: 'hook', gap: 0.5 }),
  LN('narrator', '*200,000 tonnes* of stone, removed *by hand*. From the *top, down*.', 'Two hundred thousand tonnes of stone, removed by hand. From the top, down.', { omni: '[surprise-oh] Two hundred thousand tonnes of stone, removed by hand. From the top, down.', id: 'carve', gap: 0.5 }),
  LN('narrator', 'One wrong strike, and there was *no going back*.', 'One wrong strike, and there was no going back.', { id: 'strike', gap: 0.5 }),
].map(l => ({ ...l, omniSpeed: l.omniSpeed || 0.9 }));
if (!window.SCENE) window.SCENE = { lines: window.STB_LINES };

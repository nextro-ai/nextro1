import { registerRoot, Composition, AbsoluteFill } from "remotion";
import { THEMES, Logo, display, body, label, Topo } from "../../brand";

/** Palette board: the 4 colour options side by side (one quarter each). */
const Board: React.FC = () => (
  <AbsoluteFill style={{ flexDirection: "row", flexWrap: "wrap" }}>
    {Object.values(THEMES).map((t) => (
      <div key={t.id} style={{ width: 540, height: 960, position: "relative", overflow: "hidden", background: t.bg }}>
        <Topo color={t.topo} opacity={0.12} scale={0.7} />
        <div style={{ position: "absolute", left: 40, top: 150, right: 40 }}>
          <Logo kind="full" color={t.ink} height={40} />
          <div style={{ ...label(26, t.ink2), marginTop: 26 }}>{t.name}</div>
          <div style={{ ...display(62, t.ink), marginTop: 18 }}>
            Te están <span style={{ background: t.accentSoft, padding: "0 6px" }}>buscando.</span>
          </div>
          <div style={{ ...body(26, t.ink2), marginTop: 16 }}>Que te encuentren. Que te elijan.</div>
          <div style={{ marginTop: 28, background: t.dark, borderRadius: 22, padding: "26px 26px" }}>
            <div style={{ ...display(40, t.onDark) }}>Con Lonso Lab,</div>
            <div style={{ ...body(24, t.onDark2), marginTop: 8 }}>tu negocio aparece completo.</div>
            <div style={{ marginTop: 18, background: t.surface, borderRadius: 16, padding: "14px 18px" }}>
              <div style={{ ...label(24, t.ink) }}>Tu negocio</div>
              <div style={{ ...body(20, t.ink2) }}>
                <span style={{ color: t.star }}>★★★★★</span> 4,9 · <span style={{ color: t.ok, fontWeight: 700 }}>Abierto ahora</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 28, display: "inline-block", background: t.accent, color: t.onAccent, ...label(28), padding: "18px 30px", borderRadius: 999 }}>
            Auditoría gratis
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 30 }}>
            {[t.bg, t.ink, t.dark, t.accent, t.surface].map((c, i) => (
              <div key={i} style={{ width: 56, height: 56, borderRadius: 14, background: c, border: `2px solid ${t.line}` }} />
            ))}
          </div>
        </div>
      </div>
    ))}
  </AbsoluteFill>
);
registerRoot(() => <Composition id="Board" component={Board} durationInFrames={60} fps={30} width={1080} height={1920} />);

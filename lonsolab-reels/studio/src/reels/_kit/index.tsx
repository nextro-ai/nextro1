import { registerRoot, Composition, AbsoluteFill } from "remotion";
import { C, display, body, label, Logo, Topo, Phone, Icon, SafeZone } from "../../brand";

const Kit: React.FC = () => (
  <AbsoluteFill style={{ background: C.papel }}>
    <Topo color={C.cobalto} opacity={0.35} drawFrom={0} />
    <AbsoluteFill style={{ padding: "260px 150px 420px 64px", gap: 28 }}>
      <Logo kind="full" height={70} />
      <div style={display(118, C.tinta)}>Te están buscando.</div>
      <div style={{ ...display(118, C.cobalto) }}>Que te elijan.</div>
      <div style={body(40, C.tinta2)}>Todos los días, gente de tu zona busca en Google lo que vendés.</div>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <div style={{ ...label(40, C.tinta), background: C.pin, padding: "26px 44px", borderRadius: 999 }}>Quiero mi auditoría gratis</div>
        <Icon name="pin" size={70} color={C.pin} />
        <Icon name="estrella" size={70} color={C.estrella} fill={C.estrella} />
      </div>
      <div style={{ display: "flex", gap: 30, alignItems: "flex-end" }}>
        <Phone width={330} height={680} bezel={12}><div style={{ ...label(26, C.tinta), padding: "120px 30px" }}>Google Maps</div></Phone>
        <div style={{ background: C.tinta, padding: 30, borderRadius: 18 }}><Logo kind="mark" variant="white" height={200} /></div>
        <div style={{ background: C.cobalto, padding: 30, borderRadius: 18 }}><Logo kind="mark" variant="papel" height={200} /></div>
      </div>
    </AbsoluteFill>
    <SafeZone force />
  </AbsoluteFill>
);
registerRoot(() => <Composition id="Kit" component={Kit} durationInFrames={90} fps={30} width={1080} height={1920} />);

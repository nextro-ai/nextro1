# Reel 6 · `rebrand` — "¿Tu marca está hibernando?" (Composition id `Rebrand`)

**Formato**: antes → después de identidad con una **marca ficticia** ("Panadería La Espiga") y etiqueta
"Ejemplo ilustrativo". **Mood**: premium, elegante, de despertar (frío → cálido).
**Música**: `MUSIC.rebrand` — "Cold to Warm", piano + ambient, 92,2 BPM, beat = 19,52 f, compás = 78,1 f.
Es un empalme: parte A (piano frío y escaso) + parte B (pausa y luego florece).
**Duración**: 939 frames (31,3 s). Cues: `splice` f314 (empieza la parte B, muy tranquila), **`bloom` f471**
(la música florece: todo pasa a cálido).

## Look
- **Antes (f0–470)**: frío. Paleta desaturada azul hielo (`#dfe6ee`, `#9fb0c3`, tinta). Copos/partículas de escarcha
  cayendo lento (determinista). Vidrio esmerilado (backdrop blur simulado con capas). Todo lento: entradas de 20–30 f.
- **Marca vieja** (ficticia, hecha por vos en SVG/HTML): logo genérico y anticuado de "Panadería La Espiga": espiga
  tipo clip-art con degradé, tipografía script/redondeada genérica (usá una genérica del sistema o Archivo deformado),
  sombra paralela, colores marrón/amarillo apagados. Que se vea *genérica*, no ridícula.
- **Después (f471–939)**: cálido y premium. Paleta de la marca nueva de La Espiga (por ejemplo trigo `#e9c46a`,
  horno `#c8553d`, crema `#f6efe4`, carbón `#1f1b16`). Wordmark nuevo construido sobre una grilla con líneas de
  construcción que se dibujan (`evolvePath`), barrido de luz especular. Sistema: logo, paleta (3–4 chips con nombre),
  tipografía ("Aa"), aplicaciones como mockups simples hechos en código: cartel de frente de local, bolsa de papel,
  perfil de Instagram (círculo + grilla), tarjeta de mapa con pin, web en un celular.
- Etiqueta chica permanente **"Ejemplo ilustrativo"** (tinta2/papel, 26 px) en zona segura.

## Guion
| Frames | Imagen | Texto | SFX |
|---|---|---|---|
| 0–156 | Escarcha cayendo sobre el logo viejo de La Espiga, dentro de un círculo de vidrio esmerilado | f0: **"¿Tu marca está hibernando?"** (visible desde f0, se revela suave) | `whoosh_long` muy bajo f0 |
| 157–234 | El logo viejo en un cartel gastado | **"El mismo logo desde siempre."** | — |
| 235–313 | El logo se achica a un circulito de perfil y se vuelve ilegible | **"No se lee en el circulito de Instagram."** | `tick` f235 |
| 314–392 | (parte B, muy calma) Oscurece; aparece el oso de Lonso Lab (logo mark papel) tenue | **"Tu negocio creció."** | — |
| 393–470 | La escarcha empieza a agrietarse desde el centro; brillo cálido detrás | **"Es hora de despertarla."** | `riser_2s` termina en f471 |
| **471** | **BLOOM**: la escarcha se quiebra/derrite, el frío se va a cálido; el logo viejo se desarma en piezas | — | `boom_sub` f471 + `whoosh_long` (pico f471) |
| 472–548 | Construcción del logo nuevo sobre grilla (líneas de construcción, círculos) → wordmark "La Espiga" + símbolo simple | label "Logo" | `snap` f510 |
| 549–626 | Paleta: chips de color que entran en beats con nombre | label "Paleta" | `pop` en cada chip |
| 627–704 | Tipografía: "Aa" gigante + alfabeto | label "Tipografía" | — |
| 705–782 | Aplicaciones, una por beat (f705, f725, f744, f764): cartel, bolsa, perfil de IG, pin de mapa / web | label "Aplicaciones" | `swipe` en cada una |
| 783–860 | Grilla final de aplicaciones | **"Rebranding · Identidad · Aplicaciones"** + "Despertamos tu marca." | — |
| 861–939 | Cierre: logo Lonso Lab, **"Contanos de tu marca."**, "lonsolab.com · WhatsApp +54 3541 33-7818" | — | `success_chime` f861 |

## Notas
- El cambio de f471 tiene que sentirse: es el corazón del reel (frío → cálido, lento → con pulso).
- Antes del bloom, todo lento y con aire; después, cortes en beats (19,5 f) con elegancia, sin shake.
- La marca nueva tiene que verse realmente bien diseñada (es la prueba de oficio).

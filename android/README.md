# Mochi Guard 🌸

App Android de bienestar digital con estética kawaii en colores pastel crema.

## Funciones

- **Hoy 💗** — Tiempo de pantalla total de hoy y ranking de apps más usadas, con barras animadas.
- **Apps 🎀** — Lista de tus apps: activa el bloqueo con un switch o ponles un límite diario (en pasos de 5 min, hasta 4 h).
- **Modo concentración 🌙** — Bloquea temporalmente todas tus apps "vigiladas" (las bloqueadas o con límite) durante 15 min a 6 h.
- **Pantalla de descanso kawaii 🧸** — Cuando abres una app bloqueada o superas tu límite, aparece una pantalla animada que te invita a descansar.

Todo se guarda localmente en el teléfono; la app no tiene internet ni envía datos.

## Permisos que pide (y por qué)

| Permiso | Para qué |
|---|---|
| Acceso a uso 📊 | Medir el tiempo de pantalla y aplicar límites diarios |
| Accesibilidad 🧸 | Detectar qué app está en primer plano para poder bloquearla |
| Mostrar sobre otras apps 🎈 | Que la pantalla de bloqueo aparezca al instante |

Los tres se conceden desde la pestaña **Ajustes 🌷** de la propia app.

## Compilar

Requiere JDK 17+ y Android SDK (platform 35). Desde la raíz del repo:

```bash
gradle -p android assembleDebug
# APK en: android/app/build/outputs/apk/debug/app-debug.apk
```

También hay un workflow de GitHub Actions (`.github/workflows/android-apk.yml`) que
compila el APK en cada push a la rama y lo publica como Release.

## Estructura

- `app/src/main/java/com/nextro/mochiguard/`
  - `MainActivity.kt` — navegación inferior con 3 pestañas
  - `ui/DashboardFragment.kt` — panel "Hoy"
  - `ui/AppsFragment.kt` — lista de apps, bloqueo y límites
  - `ui/SettingsFragment.kt` — permisos y modo concentración
  - `ui/BlockedActivity.kt` — pantalla de bloqueo kawaii
  - `service/AppBlockerService.kt` — servicio de accesibilidad que aplica los bloqueos
  - `core/UsageStatsHelper.kt` — cálculo del tiempo de pantalla (UsageEvents)
  - `core/Prefs.kt` — persistencia de bloqueos, límites y modo concentración

# Қосымша активтер

- `chips-reference.png` — пайдаланушы жіберген `image(20261020-104614).png` файлының өзгертілмеген көшірмесі. Hulk принті осы фотодан canvas арқылы алынады.
- Түрлі түсті SpongeBob принті репозиторийдегі `posters/901.webp` суретінен canvas арқылы алынады. Постер дереккөзі `ASSET_SOURCES.json` ішінде сақталған.
- Әр фишканың көк артқы беті дәл сол алдыңғы беттің пиксельдерінен монохромға айналдырылады. Ұпайы бөлек 8 фишка екі негізгі принтті қолданады.
- `sega-reference.jpg` — пайдаланушы жіберген `telegram-cloud-photo-size-2-5384257713820343488-w.jpg` файлының өзгертілмеген көшірмесі. Экран бөлігі приставка текстурасы үшін canvas арқылы оқылады.

## Пайдаланушы берген GLB модельдері

Барлық модель жергілікті файлдан жүктеледі; файлдардың ішіндегі автор мәліметтері мен текстуралар сақталған. Three.js ішінде тек өлшемі, орталығы және сахнадағы орналасуы бейімделеді. Лицензиялары: [Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/).

| Файл | Модель | Автор / дереккөз | Үшбұрыш |
| --- | --- | --- | --- |
| `models/jake.glb` | Jake Subway Surfers real | [gilmageo000](https://sketchfab.com/3d-models/jake-subway-surfers-real-825926cbb5734b9e904a61549a9de640) | 1 372 |
| `models/bmo.glb` | BMO / Adventure Time | [Jzero_95](https://sketchfab.com/3d-models/bmo-adventure-time-bmo-hora-de-aventura-c746c7382fe748759b7f11eda14b8b9a) | 15 147 |
| `models/spongebob.glb` | SpongeBob Squarepants | [Tom](https://sketchfab.com/3d-models/spongebob-squarepants-e4d080cc271b40338d390e3912525680) | 28 701 |

Steve, Creeper, Sega және Red модельдері `nostalgia.js` ішінде Three.js примитивтерімен жасалған. Модель сервисі немесе API кілті қажет емес.

## Модель жүктеушісі

`vendor/GLTFLoader.js` — [Three.js 0.128.0](https://www.npmjs.com/package/three/v/0.128.0) пакетінің өзгертілмеген `examples/js/loaders/GLTFLoader.js` файлы. Ол репозиторийдегі Three.js r128 нұсқасына сәйкес. MIT лицензиясы `vendor/THREE-LICENSE.txt` ішінде.

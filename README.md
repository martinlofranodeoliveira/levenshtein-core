# levenshtein-core

Levenshtein edit distance with operation alignment and similarity.
Code-point aware, zero runtime dependencies, Node >= 22.

Part of the LOFRANO TECNOLOGIA open-source lab. MIT.

```js
import { distance, align } from './src/levenshtein.mjs';
distance('kitten', 'sitting'); // 3
```

```sh
npm test          # 6 tests, node:test, no dependencies
npm run demo
```

At most 2000 code points per string. MIT — see `LICENSE`.
[Versão em português](README.pt-BR.md).

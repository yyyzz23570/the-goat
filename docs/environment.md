# Development environment

Documented from information that can be verified in this repository, prior course-repo work, or the public implementation repository named in `README.md`. Items that cannot be verified are marked **TBD / To be confirmed**. No stack is guessed for this course repository.

## This repository (`the-goat`)

| Item | Current record | Evidence |
| --- | --- | --- |
| Programming language | TBD / To be confirmed | No language project files (`package.json`, `pyproject.toml`, etc.) in this repository |
| Runtime | TBD / To be confirmed | No runtime or start script in this repository |
| Frontend technology | Placeholder only (`frontend/README.md`) | Directory exists; no application code |
| Backend technology | Placeholder only (`backend/README.md`) | Directory exists; no application code |
| Package manager | TBD / To be confirmed | No lockfile or package manifest in this repository |
| Version control | Git + GitHub | Remote: `https://github.com/yyyzz23570/the-goat.git` |
| VS Code | TBD / To be confirmed | `.gitignore` lists `.vscode/`, which is a common ignore rule and does not prove the editor is in use |
| Cursor | In use for documentation and scaffold work | Used to create the initial scaffold and this documentation set |
| Local model / model runner | TBD / To be confirmed | Not present in this repository |
| Runnable app in this repo | No | `frontend/` and `backend/` are placeholders |

## Proposed tools already written in this repository

From [`jingbo-plan/jingbo-demo.md`](jingbo-plan/jingbo-demo.md) (proposal by Jingbo He, **not implemented in this repository**):

| Item | Proposal |
| --- | --- |
| Data storage | SQLite |
| Hosting | Netlify |
| LLM API | OpenAI API |

These remain proposals until the team confirms they apply to this course repository.

## Implementation source to be migrated here

The README names [Wayly-mvp1](https://github.com/13haodeH/Wayly-mvp1) as the current working/implementable product. A teammate will migrate that implementation into `the-goat`. Observed from that repository's public files (for reference only; **not installed here yet**):

| Item | Observed in Wayly-mvp1 | Notes |
| --- | --- | --- |
| Programming language | TypeScript | `tsconfig.json`, `.ts` project files |
| Runtime | Node.js `>=22.13.0` | `package.json` `engines` |
| Frontend technology | React | `package.json` dependencies |
| App tooling | vinext / Vite | `package.json` scripts, `vite.config.ts`, `next.config.ts` present |
| Package manager | npm | `package-lock.json` and `npm` scripts |
| LLM | DeepSeek (optional key) | `.env.example` (`DEEPSEEK_API_KEY`, `DEEPSEEK_BASE_URL`) |
| Other services | Optional Supabase | `.env.example` |
| Map library | Leaflet dependency present | A named Map Provider API is still TBD / To be confirmed |
| Local model / model runner | Not documented as a local runner in the public README / `.env.example` | Cloud API key is optional |

Do **not** treat the Wayly-mvp1 stack as the installed environment of `the-goat` until those files are actually present here. After the teammate migration, this document should be updated from the landed files.

## How to work in this course repository

No install, build, or application start is required or possible from the files in `the-goat` today.

```text
git clone <this-repository>
# then open README.md, SPEC.md, and docs/
```

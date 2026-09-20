# Development environment

Documented from information that can be verified in this repository. Items that cannot be verified are marked **TBD / To be confirmed**.

## This repository (`the-goat`) — Lab 0 baseline

| Item | Current record | Evidence |
| --- | --- | --- |
| Programming language | Python | `backend/app.py`, `backend/test_app.py` |
| Runtime | Python 3.12+ (local check used 3.13.5) | `python --version`; CI uses 3.12 |
| Frontend technology | Static HTML / JavaScript | `frontend/index.html` |
| Backend technology | Flask | `backend/app.py`, `backend/requirements.txt` |
| Package manager | pip | `backend/requirements.txt` |
| Development tools | Git, GitHub Actions, pytest | `.github/workflows/ci.yml`, `pytest.ini` |
| Version control | Git + GitHub | Remote: `https://github.com/yyyzz23570/the-goat.git` |
| VS Code | TBD / To be confirmed | `.gitignore` lists `.vscode/`; that does not prove the editor is in use |
| Cursor | In use | Scaffold, documentation, and Lab 0 baseline |
| Local model / model runner | TBD / To be confirmed | Not present in this repository |
| Runnable app in this repo | Lab 0 only: hard-coded API + page | `python backend/app.py` then `http://127.0.0.1:8000/` |

## Proposed tools already written in this repository

From [`jingbo-plan/jingbo-demo.md`](jingbo-plan/jingbo-demo.md) (proposal by Jingbo He, **not required for Lab 0**):

| Item | Proposal |
| --- | --- |
| Data storage | SQLite |
| Hosting | Netlify |
| LLM API | OpenAI API |

## Full implementation source to be migrated here

The README names [Wayly-mvp1](https://github.com/13haodeH/Wayly-mvp1) as the current full product. A teammate will migrate that implementation into `the-goat`. Observed from that repository's public files (not installed here yet):

| Item | Observed in Wayly-mvp1 | Notes |
| --- | --- | --- |
| Programming language | TypeScript | `tsconfig.json`, `.ts` project files |
| Runtime | Node.js `>=22.13.0` | `package.json` `engines` |
| Frontend technology | React | `package.json` dependencies |
| App tooling | vinext / Vite | `package.json` scripts |
| Package manager | npm | `package-lock.json` |
| LLM | DeepSeek (optional key) | `.env.example` |
| Other services | Optional Supabase | `.env.example` |
| Map library | Leaflet dependency present | A named Map Provider API is still TBD / To be confirmed |
| Local model / model runner | Not documented as a local runner | Cloud API key is optional |

After the teammate migration, this document should be updated from the landed files.

## How to work in this course repository

```text
python -m pip install -r backend/requirements.txt
python backend/app.py
# open http://127.0.0.1:8000/
python -m pytest -q
```

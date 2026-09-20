# Development environment

Documented from information that can be verified in this repository. Items that cannot be verified are marked **TBD / To be confirmed**.

## This repository (`the-goat`) — current course baseline

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
| Cursor | In use | Scaffold, documentation, Lab 0, and Walking Skeleton |
| Local model / model runner | TBD / To be confirmed | Not present in this repository |
| Runnable app in this repo | Walking Skeleton: Traveler page + stubbed Wayly System | `python backend/app.py` then `http://127.0.0.1:8000/` |
| Map Provider API | Local hard-coded stub | `stub_map_provider()` in `backend/app.py` |
| LLM API | Local hard-coded stub | `stub_llm_api(...)` in `backend/app.py` |

## Proposed tools already written in this repository

From [`jingbo-plan/jingbo-demo.md`](jingbo-plan/jingbo-demo.md) (proposal by Jingbo He, **not required for the Walking Skeleton**):

| Item | Proposal |
| --- | --- |
| Data storage | SQLite |
| Hosting | Netlify |
| LLM API | OpenAI API |

## How to work in this course repository

```text
python -m pip install -r backend/requirements.txt
python backend/app.py
# open http://127.0.0.1:8000/
python -m pytest -q
```

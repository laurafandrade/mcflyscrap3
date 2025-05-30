# McFly Scraping

Projeto que oferece uma interface web para scraping básico de sites.  
Usuário insere a URL, o backend baixa o HTML e imagens, empacota em ZIP e gera download.

## Como rodar localmente

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

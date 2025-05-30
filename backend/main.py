from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
import aiohttp
import asyncio
import io
import zipfile
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup

app = FastAPI()

async def fetch_content(session, url):
    async with session.get(url) as response:
        if response.status != 200:
            raise HTTPException(status_code=400, detail=f"Failed to fetch {url}")
        return await response.read()

async def scrape_site(url: str):
    async with aiohttp.ClientSession() as session:
        html_bytes = await fetch_content(session, url)
        html_str = html_bytes.decode('utf-8', errors='ignore')

        soup = BeautifulSoup(html_str, 'html.parser')

        # Encontrar imagens para baixar
        img_tags = soup.find_all('img')
        img_urls = set()
        for img in img_tags:
            src = img.get('src')
            if src:
                full_url = urljoin(url, src)
                img_urls.add(full_url)

        # Criar ZIP em memória
        zip_buffer = io.BytesIO()
        with zipfile.ZipFile(zip_buffer, 'w') as zipf:
            # Adiciona o HTML como index.html
            zipf.writestr('index.html', html_str)

            # Baixar e adicionar imagens
            for img_url in img_urls:
                try:
                    img_data = await fetch_content(session, img_url)
                    path = urlparse(img_url).path
                    filename = path.split('/')[-1]
                    if filename:
                        zipf.writestr(f'images/{filename}', img_data)
                except:
                    pass

        zip_buffer.seek(0)
        return zip_buffer

@app.post("/scrape")
async def scrape(request: Request):
    data = await request.json()
    url = data.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="Missing URL")
    try:
        zip_file = await scrape_site(url)
        return StreamingResponse(zip_file, media_type="application/zip", headers={"Content-Disposition": "attachment; filename=mcfly_scraping.zip"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

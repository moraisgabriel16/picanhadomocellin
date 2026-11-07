"""Sincroniza menu-data.js usando o arquivo editável menu.json.

Execução: python scripts/sync-menu.py
"""
from pathlib import Path
import json
root = Path(__file__).resolve().parents[1]
data=json.loads((root/'menu.json').read_text(encoding='utf-8'))
assert isinstance(data,list)
for item in data:
    assert set(('category','name','price')).issubset(item)
    assert float(item['price']) >= 0
(root/'menu-data.js').write_text('// Arquivo gerado automaticamente. Altere menu.json e rode python scripts/sync-menu.py\nwindow.MOCELLIN_MENU = '+json.dumps(data,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print(f'{len(data)} itens sincronizados.')

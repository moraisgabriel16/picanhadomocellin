# Picanha do Mocellin — site e cardápio digital

## Arquivos
- `index.html`: página de divulgação
- `cardapio.html`: cardápio digital com busca e filtros
- `menu.json`: itens e preços editáveis
- `styles.css`: identidade visual e responsividade
- `menu.js`: filtros e renderização do cardápio
- `assets/`: imagens extraídas do PDF fornecido
- `cardapio-original.pdf`: cardápio original

## Publicação
Projeto estático, sem build nem backend. Faça upload desta pasta para um repositório GitHub e importe na Vercel com **Framework Preset: Other** e **Output Directory: .**. Alternativamente, use Netlify ou qualquer hospedagem estática.

## Teste local
No terminal, dentro da pasta:
```bash
python -m http.server 8000
```
Abra `http://localhost:8000` no navegador. Abrir o HTML diretamente com `file://` pode bloquear a leitura de `menu.json`.

## Atualizar preços
Edite `menu.json` mantendo a estrutura `category`, `name`, `price` e `description`. Os valores são numéricos com ponto decimal.

## Observações
- As imagens são reproduções de páginas do PDF fornecido pelo estabelecimento, não fotografias independentes.
- O site não coleta pedidos nem pagamentos.
- Endereço e telefone não foram informados e não foram inventados.
- Domingo não teve horário informado; consulte o Instagram.
- A nota do PDF sobre preços por 100g foi aplicada aos itens de churrasco; confirme com o estabelecimento eventuais exceções.
- As fontes DM Sans e Oswald são carregadas pelo Google Fonts, com fallback local.

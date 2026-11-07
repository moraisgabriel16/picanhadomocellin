# Picanha do Mocellin — Site e cardápio digital (v2)

## Como usar

Abra **index.html** para a página de divulgação e **cardapio.html** para consultar o cardápio. O projeto é estático e funciona sem backend. Pode publicar a pasta inteira na Vercel, Netlify, GitHub Pages ou qualquer hospedagem de sites estáticos.

No Vercel: **Add New > Project**, importe um repositório contendo estes arquivos, selecione **Other** como framework e deixe o diretório de saída em branco. Não é necessário build. Se preferir, carregue o projeto no seu repositório GitHub primeiro.

## O que mudou

- Nova direção de arte de restaurante, com tipografia editorial, fotografia real extraída do cardápio fornecido, tom de carvão, papel e cobre.
- Home reformulada: capa, manifesto, destaques de cortes, experiência e horários.
- Cardápio reformulado: carta editorial com navegação por categorias, busca instantânea sem acentos, fotos de seções, preços claros e notas sobre gramagem.
- Lista pessoal para marcar pratos e copiar escolhas. **Não envia pedidos, não efetua pagamento nem reservas**.
- Site responsivo, metadados sociais, âncoras, animações sutis, apoio a teclado e acessibilidade, imagens otimizadas WebP.
- Ícones Lucide carregados via CDN como melhoria progressiva; fontes Google Fonts opcionais (o site também funciona sem eles).

## Atualizar produtos e preços

Edite **menu.json**. Cada item contém `category`, `name`, `price` (número em reais), `description` (opcional). Depois execute:

```bash
python scripts/sync-menu.py
```

Isso atualiza `menu-data.js`, que o navegador usa sem necessidade de servidor. Preserve os nomes das categorias existentes para manter a navegação. Atualmente: **95 itens em 11 categorias**.

## Horários e contato

- Segunda a quinta: 17h30–23h30
- Sexta e sábado: 17h30–00h00
- Instagram: https://www.instagram.com/picanhadomocellin
- Domingo: não informado; nenhuma informação foi presumida.

## Fotos e preços

As fotos foram extraídas do arquivo **“Cardápio - Picanha MocellinREV09.pdf”**, entregue para este projeto, e otimizadas em WebP. Algumas fotos são ilustrações de seções e não devem ser entendidas como foto exclusiva de cada produto. Preços e descrições se baseiam na versão do PDF fornecida; revise com o estabelecimento antes da publicação. Não inclua um endereço ou telefone sem confirmação.

**Aviso:** o PDF original foi omitido do ZIP para reduzir drasticamente o tamanho do pacote. O arquivo menu.json contém o catálogo digital.

## Estrutura

```
index.html            - Página de divulgação
cardapio.html         - Cardápio digital
styles.css            - Estilos responsivos
site.js               - Animações suaves e ícones
menu.js               - Busca, navegação e seleção
menu.json             - Dados editáveis do cardápio
menu-data.js          - Dados consumidos pelo navegador
scripts/sync-menu.py  - Sincronização dos dados
assets/images/        - Imagens otimizadas da marca e dos pratos
```

## Personalização para publicação

Ao publicar com domínio próprio, você pode editar `og:image` e inserir uma URL absoluta da foto de capa para melhorar a prévia em compartilhamentos. O projeto não pressupõe nem inventa endereço, telefone, WhatsApp ou serviço de pedidos.

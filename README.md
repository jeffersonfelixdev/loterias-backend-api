# loterias-backend API
API de consulta das loterias da Caixa

## Setup (desenvolvimento)
* Instalar e executar MongoDB;
* Criar uma cópia de `.env.sample` e renomear para `.env`, editando o arquivo com a porta que deseja utilizar para executar o backend;
* Criar uma cópia de `ormconfig.json.sample` e renomear para `ormconfig.json`, editando o arquivo com os dados de conexão com sua base MongoDB;
* Executar dentro da pasta do código o comando `yarn dev:server`.

## Rotas

### `GET /jogos/:concurso`
Obtém todos os jogos de um concurso com nome `:concurso` cadastrados na base de
dados do MongoDB.

Exemplo: `GET /jogos/megasena`

Retorno:
```
{
  "success": true,
  "data": [
    { ... },
    { ... },
    { ... },
    { ... }
  ]
}
```

### `GET /jogos/:concurso/latest`
Obtém o último resultado de um concurso com o nome `:concurso` diretamente da base
da Caixa Econômica Federal. Caso este resultado não esteja salvo na base de dados
local, o mesmo será cadastrado.

Exemplo: `GET /jogos/lotofacil/latest`

Retorno:
```
// 20201117171702
// http://localhost:3333/jogos/lotofacil/latest

{
  "success": true,
  "data": {
    "tipoJogo": "LOTOFACIL",
    "numero": 2083,
    "nomeMunicipioUFSorteio": "SÃO PAULO, SP",
    "dataApuracao": "16/11/2020",
    "valorArrecadado": 25310282.5,
    "valorEstimadoProximoConcurso": 1500000,
    "valorAcumuladoProximoConcurso": 0,
    "valorAcumuladoConcursoEspecial": 18385094.07,
    "valorAcumuladoConcurso_0_5": 781645.18,
    "acumulado": false,
    "indicadorConcursoEspecial": 1,
    "dezenasSorteadasOrdemSorteio": [
      "024",
      "012",
      "022",
      "004",
      "023",
      "009",
      "005",
      "021",
      "016",
      "011",
      "020",
      "014",
      "007",
      "019",
      "010"
    ],
    ...
  }
}
```

### `GET /jogos/:concurso/:numero`
Obtém o resultado de um concurso específico. Primeiro, é verificado se o resultado
já está cadastrado na base de dados. Em caso negativo, busca-se na base da Caixa
Econômica Federal. Em encontrando o resultado, o mesmo é exibido e salvo na base
de dados local. Caso não seja encontrado na base da CEF, uma mensagem de erro é
exibida.

Exemplo: `GET /jogos/quina/5415`

Retorno:
```
{
  "success": true,
  "data": {
    "tipoJogo": "QUINA",
    "numero": 5415,
    "nomeMunicipioUFSorteio": "SÃO PAULO, SP",
    "dataApuracao": "13/11/2020",
    "valorArrecadado": 7893728,
    "valorEstimadoProximoConcurso": 2400000,
    "valorAcumuladoProximoConcurso": 1490516.9,
    "valorAcumuladoConcursoEspecial": 55930852.81,
    "valorAcumuladoConcurso_0_5": 0,
    "acumulado": true,
    "indicadorConcursoEspecial": 1,
    "dezenasSorteadasOrdemSorteio": [
      "004",
      "065",
      "018",
      "073",
      "024"
    ],
    ...
  }
}
```

### `POST /urls`
Atualiza todas as URLs de consulta da Caixa Econômica Federal. Recomenda-se executar
este método diariamente para manter as URLs atualizadas.

### `POST /urls/:concurso`
Atualiza a URL de um concurso específico.

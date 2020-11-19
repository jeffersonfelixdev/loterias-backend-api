#!/bin/bash

cd /home/deploy/

# Informe seu TOKEN
TOKEN="SEU_TOKEN_AQUI"

# Requisição do último concurso
curl -H 'Accept: application/json' -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" "http://localhost:8080/jogos/$1/latest" > latest.json

# armazena o número do último concurso
LATEST=$(cat latest.json | jq '.data.numero')

echo "Processando carga da loteria $1..."

# Loop para recuperação de todos os concursos
for numero in $(seq 1 $LATEST); do curl -H 'Accept: application/json' -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" "http://localhost:8080/jogos/$1/$numero?q=true"; done

echo "Processamento concluído com sucesso"

rm -rf /home/deploy/latest.json

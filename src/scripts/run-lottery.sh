#!/bin/bash

cd /home/deploy/

# Informe seu TOKEN e PORTA da API
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoidUF4X2xjMGtvd3Z3MDNoZjJvIiwiaWF0IjoxNjA1Nzk1Mzk2fQ.sWlu3equ7UZqP-Z1GNOIpL7bSU-qJASGrpwu_w1y-Vg"
PORT=3333

# Requisição do último concurso
curl -H 'Accept: application/json' -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" "http://localhost:$PORT/jogos/$1/latest" > $1-latest.json

# armazena o número do último concurso
LATEST=$(cat $1-latest.json | jq '.data.numero')

echo "Processando carga da loteria $1..."

# Loop para recuperação de todos os concursos
for numero in $(seq 1 $LATEST); do curl -H 'Accept: application/json' -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" "http://localhost:$PORT/jogos/$1/$numero?q=true"; done

echo "Processamento concluído com sucesso"

rm -rf /home/deploy/$1-latest.json

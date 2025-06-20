#!/bin/bash

set -e

API_URL="http://localhost:3000/veiculos"

echo "==> Criando veículo..."
RESPONSE=$(curl -s -X POST $API_URL \
  -H "Content-Type: application/json" \
  -d '{
    "placa": "ABC1234",
    "chassi": "12345678901234567",
    "renavam": "12345678901",
    "modelo": "Civic",
    "marca": "Honda",
    "ano": 2023
  }')

ID=$(echo $RESPONSE | jq -r .id)
echo "ID do veículo criado: $ID"

echo "==> Aguardando processamento do consumer de ativação..."
sleep 3

echo "==> Consultando veículo após ativação..."
curl -s $API_URL/$ID | jq

echo "==> Removendo (lógica) o veículo..."
curl -s -X DELETE $API_URL/$ID

echo "==> Aguardando processamento do consumer de desativação..."
sleep 3

echo "==> Consultando veículo após desativação..."
curl -s $API_URL/$ID | jq

echo "==> Fim do teste E2E!" 
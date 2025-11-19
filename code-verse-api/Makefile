#!/bin/bash
-include .env
export 
TEST_TARGET := e2e integration unit

.PHONY: setup build test module prisma db dev prod env clean reset

setup:
	@echo "📦 Creando entorno..."
	@bash scripts/create-env.sh
	@bash scripts/create-db.sh
	@bash scripts/create-session.sh
	@echo "✅ Entorno creado"

session:
	@bash scripts/create-session.sh
	@echo "✅ Sesión creada"

build:
	docker-compose up -d db
	@echo "⏳ Esperando a que DB esté lista..."
	sleep 10
	docker-compose run --rm app npm run prisma:generate
	docker-compose run --rm app npm run prisma:migrate
	@echo "✅ DB lista y migrada"

prod:
	docker-compose up -d --build

deploy:
	@echo "🧼 Deteniendo contenedores anteriores (sin eliminar datos)"
	make clean
	@echo "🚀 Desplegando entorno completo"
	make build
	make prod
	@echo "♻️ Verificando si nginx está activo..."
	@if systemctl is-active --quiet nginx; then \
		echo "🔄 Recargando nginx"; \
		sudo -n systemctl reload nginx || echo '⚠️ No se pudo recargar nginx (requiere sudo sin contraseña)'; \
	else \
		echo "⚠️ Nginx no está activo, omitiendo reload."; \
	fi
	@echo "✅ Despliegue completo"

dev:
	docker-compose up --build

prisma:
	docker-compose run --rm app npm run prisma:generate
	docker-compose run --rm app npm run prisma:migrate

test:
	@bash scripts/run-test.sh

env:
	@bash scripts/create-env.sh

clean:
	docker-compose down

clean-docker:
	docker system prune -f
	docker volume prune -f

clean-tmp:
	sudo find /tmp -type f -atime +1 -delete

clean-full:
	docker-compose down -v
	docker system prune -a --volumes -f

reset:
	docker system prune -a --volumes -f
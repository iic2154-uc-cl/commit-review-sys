#!/bin/bash
-include .env
export 

.PHONY: deploy

deploy:
	docker system prune -f
	@echo "Deploying to production..."
	docker build -t code-verse-front .
	docker run -d -p 3000:80 --name code-verse-front-container code-verse-front
	@echo "Deployment complete. Access the app at http://localhost:3000"

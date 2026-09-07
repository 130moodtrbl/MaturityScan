# ==========================================================-=========== Context
IMAGE_130MS := MaturityScan
DOCKER_COMPOSE := docker compose -f docker-compose.yml
SERVICE := maturityscan
ENV_FILE := .env

OLLAMA_MODEL := llama3.2:1b

GREEN := \033[1;32m
YELLOW := \033[1;33m
PURPLE := \033[1;35m
RESET := \033[0m

# ============================================= Starting & stopping the MaturityScan
#	- build: build the MaturityScan image
#	- up: build (if needed) & start the MaturityScan
#	- scan: run the interactive MS (readline support, foreground)
#	- down: stop & remove the running MaturityScan
# ================================================================================
build:
	$(DOCKER_COMPOSE) build

up:
	$(DOCKER_COMPOSE) up --build

scan:
	$(DOCKER_COMPOSE) run --rm $(SERVICE) npm run dev

down:
	$(DOCKER_COMPOSE) down 

# =========================================================== Cleaning the project
#	- clean: stop & delete containers & networks BUT keeps volumes
#	- fclean: total cleanup of the stack & generated artifacts
#	- re: total clean up, rebuild & start everything
# ================================================================================
clean:
	@$(DOCKER_COMPOSE) down --remove-orphans

fclean:
	@$(DOCKER_COMPOSE) down --rmi all --volumes --remove-orphans
	@docker builder prune --force
	@rm -f maturity-assessment.md dashboard.html
	@printf "$(PURPLE)[$(YELLOW)✔$(PURPLE)] Stack has been succesfully cleaned.$(RESET)"

re: fclean up

# ======================================================================== Add-ons
#	- ps: display the status of running processes (containers)
#	- logs: display logs of running processes
#	- inside-maturityscan: open a shell inside the maturityScan container
#	- dashboard: open the generated HTML dashboard
# ================================================================================
ps:
	@$(DOCKER_COMPOSE) ps

logs:
	@$(DOCKER_COMPOSE) logs -f

inside-maturityscan:
	@docker exec -it $(SERVICE) bash

dashboard:
	@xdg-open dashboard.html

pull-model:
	$(DOCKER_COMPOSE) up -d ollama
	$(DOCKER_COMPOSE) exec ollama ollama pull $(OLLAMA_MODEL)

man:
	@echo "[ MaturityScan's Makefile manual ]\n"
	@echo "make build 	- build the MaturityScan container"
	@echo "make up       - build & start the MaturityScan container"
	@echo "make scan       - run the interactive self-assessment tool"
	@echo "make down     - stop & remove the running container"
	@echo "make re       - full cleanup, rebuild & restart"
	@echo "make clean    - remove all containers & networks"
	@echo "make fclean   - full project + artifacts cleanup"
	@echo "make logs     - display output from container"
	@echo "make ps	   	- show details about the running container"
	@echo "make dasboard - open the HTML dashboard"
	@echo "make inside-maturityscan - execute a shell inside the container"

# ==========================================================-=========== Config
.PHONY: build up scan down clean fclean re ps logs \
	inside-maturityscan dashboard pull-model man

## 🌿 Introduction
MaturityScan is an AI-powered CLI tool used to scan user’s answers to NIST CSF inspired questions, based on five functions and subsequent categories. It delivers a report in Markdown format, as well as a HTML dashboard for clear visual representation of the assessment. 

This tool is purely pedagogical, serving as learning material for GRC automatisation.

This is a work in progress.

## 🌿 Installation

**Prerequisites:** You should have Docker and docker compose installed on your machine, as well as enough resources to run Ollama.

1. Clone or download the repository, then at its root, run `make up` or `make build`. 
2. To pull the Ollama model, use the `make pull-model` command, this will download all necessary resources.
Alternatively, the `make man` option will give you a list of all make options. 

## 🌿 Usage
To run the project, type in the following command; `make scan`

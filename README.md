# useinf-chatbot-webhook

## Installation

```bash
npm install

# Copy env example
cp .env.example .env

# Add the necessary variables in .env
```

## Usage

```bash
# Import data (food composition) - please read "add datasets section"
npm run import:data

# Dev
npm run start:dev

# Compile TypeScript to JavaScript
npm run build

# Prod
npm run start:prod

# Deployment (with serverless)
npm run deploy
```

## Dialogflow Webhook compatibility

Please make sure to pass a well formated webhook request to test the app.
A basic example of Postman configuration file is available in this repository.

## Data import

This repository already contains the Swiss food composition datasets in `static/food-composition` - v6.1 in the available 4 languages.
Please follow the steps to import newer Excel datasets:
- Download datasets - [website](https://www.valeursnutritives.ch/en/downloads/)
- Copy and paste the files in `static/food-composition`
- Run `npm run import:data` to generate the data as JSON flat files

## Note

When importing datasets, the import script will add a list of tokens for each item.
For this, a tokenizer has been used and some word cleanup is applied.
For the search strategy, "fuzzy search" is applied with a library.

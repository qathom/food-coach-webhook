# food-coach-webhook

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

# Export data (entity integration in Dialogflow)
npm run export:data
```

## Data import

This repository already contains the Swiss food composition datasets in `static/food-composition` - v6.1 in the available 4 languages.
Please follow the steps to import newer Excel datasets:
- Download datasets from [valeursnutritives.ch](https://www.valeursnutritives.ch/en/downloads/)
- Copy and paste the files in `static/food-composition`
- Run `npm run import:data` to generate the data as JSON flat files

## Imported data structure

Example:

```json
{
  "createdAt": "2020-05-16T19:40:08.502Z",
  "data": [
    {
      "id": 10536,
      "name": "Agave syrup",
      "tokens": [
        "agave",
        "syrup",
        "sweets",
        "sugar",
        "and",
        "sweeteners"
      ],
      "category": "Sweets/Sugar and sweeteners",
      "nutrients": [
        {
          "type": "CARBOHYDRATE",
          "value": 73.1,
          "unit": "GRAM"
        },
        {
          "type": "FIBER",
          "value": 0,
          "unit": "GRAM"
        },
        {
          "type": "SUGAR",
          "value": 0,
          "unit": "GRAM"
        },
        {
          "type": "PROTEIN",
          "value": 0.2,
          "unit": "GRAM"
        }
      ],
      "energy": [
        {
          "value": 1240,
          "unit": "KJ"
        },
        {
          "value": 293,
          "unit": "KCAL"
        }
      ]
    }
  ]
}
```

## Note

When importing datasets, the import script will add a list of tokens for each item.
For this, a tokenizer has been used and some word cleanup is applied.
For the search strategy, "fuzzy search" is applied with a library.

<div align="center">
    <img src="https://raw.githubusercontent.com/ucciqun/autoform/main/docs/images/autoform.png" width="500" height="auto" alt="AutoForm"/>
</div>

AutoForm is your key to intuitive surveys. Harness the power of GPT and discover:

- 📝 Designing - Craft surveys tailored to your needs.

- 🤖 Automating - Evolve your questions based on real-time feedback.

- 📊 Analyzing - Dive deep into insights and understand your respondents.

## Running locally

You will need to use the environment variables defined in .env.example to run AutoForm.

> Note: You should not commit your .env file.

```
git clone git@github.com:ucciqun/autoform.git
npm install
npx prisma db push
npx prisma generate
npm run dev
```

## Authors

ucciqun <https://github.com/ucciqun>

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

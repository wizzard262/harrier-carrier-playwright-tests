# harrier-carrier-playwright-tests
playwright tests in typescript to test https://www.harriercarrier.com

## setup
Starting and testing a new Playwright template:
- open VS Code
- Install extension: Playwright Test for VSCode
- Terminal --> New Terminal (of node type)

	   cd C:\DEV\Repositories\GitHub\harrier-carrier-playwright-tests
	   npm init playwright@latest
       npm install
       npx playwright install

- choose Typescript (not javascript, of course!)
- choose all other default settings

This will create all necessary files, including:
- \tests\example.spec.ts (example tests looking at: https://playwright.dev/)
- \.github\workflows\playwright.yml (to build and run the tests on GitHub)
	
## run locally
     npx playwright test // default template runs 2 tests on 3 browsers = 6 tests
     npx playwright show-report //view HTML report

## run on Github
- check all code into a new github repo

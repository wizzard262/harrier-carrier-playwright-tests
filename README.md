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
- the check-in started the YAML workflow  and concludes successfully running the 2 tests over 3 browsers
- to manually run the job: from the repo actions page: 
     - first the YAML needs the *on:* setting to have under it *workflow_dispatch:* (i.e. on: has 3 sub-settings indicating the workflow will run on: PUSH, PR and MANUALLY from Github Actions via a button)
     - See: https://github.com/wizzard262/harrier-carrier-playwright-tests/blob/main/.github/workflows/playwright.yml
     - go to: https://github.com/wizzard262/harrier-carrier-playwright-tests/actions/workflows/playwright.yml and click Run Workflow

## convert template to test HarrierCarrier.com
- rename example.spec.ts to harriercarrier.spec.ts
- change the tests within to target the content on: https://www.harriercarrier.com
- in this case there are 6 tests I copied from a .Net Playwright project: https://github.com/wizzard262/HarrierCarrierPostDeployTest
        * 3 browsers = 18 tests

## note on reliability
- the redirect tests used to time out now and then, because they waited for the other site (YouTube, the games) to go quiet
    - fixed: they now only wait for the browser to move to the new address (expectRedirectTo in the spec)
- the GitHub Actions runner is pinned to ubuntu-24.04
    - ubuntu-latest moved to 26.04, which Playwright 1.60 can't install browsers on
    - STE:TODO: try ubuntu-latest again once Playwright supports 26.04
- the tall-phone game test is skipped on GitHub Actions Firefox
    - that machine has no graphics card, so Firefox can't make WebGL, and the game needs it
    - it still runs there on Chromium and WebKit, and on all 3 browsers on a PC
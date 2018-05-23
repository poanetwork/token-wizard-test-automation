const Logger = require('../entity/Logger.js');
const logger = Logger.logger;
const tempOutputPath = Logger.tempOutputPath;
const utils = require('../utils/Utils.js');
const Utils = utils.Utils;
const page = require('./Page.js');
const webdriver = require('selenium-webdriver'),
	chrome = require('selenium-webdriver/chrome'),
	firefox = require('selenium-webdriver/firefox'),
	by = require('selenium-webdriver/lib/by');
const MetaMask = require('../pages/MetaMask.js').MetaMask;
const By = by.By;
const buttonContinue = By.xpath("//*[contains(text(),'Continue')]");
const modal = By.className("modal");
//const buttonOK=By.xpath('/html/body/div[2]/div/div[3]/button[1]');
const buttonOK = By.className("swal2-confirm swal2-styled");
const buttonSkipTransaction = By.className("no_image button button_fill");
const buttonYes = By.className("swal2-confirm swal2-styled");
const buttonCancelDeployment = By.className("button button_outline");

class WizardStep4 extends page.Page {

	constructor(driver) {
		super(driver);
		this.URL;
		this.name = "WizardStep4 page: ";
	}

	async isDisplayedModal() {
		logger.info(this.name + "Is present Modal: ");
		return await super.isElementDisplayed(modal);
	}

	async waitUntilDisplayedModal() {
		logger.info(this.name + "waitUntilDisplayedModal: ");
		return await super.waitUntilDisplayed(modal);
	}

	async clickButtonContinue() {
		logger.info(this.name + "buttonContinue: ");
		return await  super.clickWithWait(buttonContinue);
	}

	async waitUntilDisplayedButtonContinue() {
		logger.info(this.name + "waitUntilDisplayedButtonContinue: ");
		return await super.waitUntilDisplayed(buttonContinue);
	}

	async clickButtonOk() {
		logger.info(this.name + "buttonOK: ");
		return await super.clickWithWait(buttonOK);
	}

	async isDisplayedButtonOk() {
		logger.info(this.name + "Is present buttonOK: ");
		return await super.isElementDisplayed(buttonOK);

	}

	async isDisplayedButtonSkipTransaction() {
		logger.info(this.name + "Is present buttonSkipTransaction: ");
		return await super.isElementDisplayed(buttonSkipTransaction);

	}

	async clickButtonSkipTransaction() {
		logger.info(this.name + "buttonSkipTransaction: ");
		try {
			await this.driver.executeScript("document.getElementsByClassName('no_image button button_fill')[0].click();");
			return true;
		}
		catch (err) {
			logger.info("Error " + err);
			return false;
		}
	}

	async clickButtonYes() {
		logger.info(this.name + "clickButtonYes: ");
		return await super.clickWithWait(buttonYes);
	}

	async deployContracts(crowdsale) {
		logger.info(this.name + "deployContracts: ");
		let timeLimitTransactions = 75;
		let Tfactor = 1;
		let allTransactions = 0;
		let skippedTransactions = 0;
		let timeLimit = timeLimitTransactions * crowdsale.tiers.length;
		let metaMask = new MetaMask(this.driver);
		do {
			logger.info("Transaction# " + allTransactions++);
			if (await metaMask.signTransaction()) {
				logger.info(" is successfull");
			}
			else {
				logger.info(" failed");
			}
			await this.driver.sleep(Tfactor * 2000);//anyway won't be faster than start time
			if (await this.isDisplayedButtonSkipTransaction()) {
				await this.clickButtonSkipTransaction();
				await super.waitUntilDisplayed(buttonYes);
				await this.clickButtonYes();
				logger.info("Transaction #" + allTransactions + " is skipped.");
				skippedTransactions++;
			}
		} while ((timeLimit-- >= 0) && (skippedTransactions <= 5) && (await this.isDisplayedModal()));

		logger.info("Crowdsale created." +
			"\n" + " Transaction were done:" + (allTransactions - skippedTransactions) +
			"\n" + "Transaction were skipped: " + skippedTransactions);
		return await this.waitUntilLoaderGone() &&
			await this.clickButtonOk();
	}

	async clickButtonCancelDeployment() {
		logger.info(this.name + "clickButtonCancelDeployment ");
		return await super.clickWithWait(buttonCancelDeployment);
	}
}

module.exports = {WizardStep4: WizardStep4}
